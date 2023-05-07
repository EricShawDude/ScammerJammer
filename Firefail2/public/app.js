 const db = firebase.firestore();

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();
signInBtn.onclick = () => auth.signInWithPopup(provider)
signOutBtn.onclick = () => auth.signOut()

auth.onAuthStateChanged(user => {
    if (user){
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `Well done dumbass ${user.displayName}`
    }else{
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = 'GERALD!!!'
    }
});

const phonelist = document.querySelector("#phoneform");
const searchlist = document.querySelector("#searchform");
const commentlist = document.querySelector("#commentform");
phonelist.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('dumbshit').add({
        name: phonelist.name.value
    })
    addDocLinear(phonelist.name.value, commentlist.name.value);
})
searchlist.addEventListener('submit', (e) => {
    e.preventDefault();
    renderReportsFromNum(phonelist.name.value);
})


const numlist = document.querySelector('#numlist');

//add stuff with a comment
function addDocLinear(num, comment = 'failure!'){
    gaming = true;
    db.collection('numbers').get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
            console.log(doc.data());
            //if the number exists, do stuff to original data
            if (doc.data().number == num){
                gaming = false;
                console.log("gaming no more")
                id = doc.id;
                var r = doc.data().reports + 1;
                console.log(r);

                var newcomments = doc.data().comments;
                newcomments.push(comment);
                console.log(newcomments);
                
                var times = doc.data().times;
                var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
                times.push(myTimestamp);

                db.collection("numbers").doc(id).set({
                    number: doc.data().number,
                    reports: r,
                    times : times,
                    comments: newcomments
                  }).then(function() {
                    console.log("Frank is dead.");
                    return;
                  });
                
            }      
        }); 

        
        if(gaming){
            addDocNew(num, comment);
        }
        
    })
    
    //if then number doesn't exist then add to database
    

}

function addDocNew(num, comment = 'failure fail'){
    console.log("gaming is a go")
    const uid = db.collection("tmp").doc().id
    db.collection("numbers").add({
        number: num,
        reports: 1,
        times : [firebase.firestore.Timestamp.fromDate(new Date())],
        comments: [comment]
    }).then(function() {
        console.log("Frank is ALIVE.");
    });
    return;
}
//USE DOC.DATA() YOU FAILURE




function rendernumbers(doc){
    let li = document.createElement('li');
    let reports = document.createElement('span');
    let num = document.createElement('span');
    let commentlist = document.createElement('li');

    li.setAttribute('data-id', doc.id);
    reports.textContent = doc.data().reports.toString() + " reports ";
    num.textContent = doc.data().number.toString();

    const commentarray = doc.data().comments;
    const timearray = doc.data().times; 
    st = "";
    commentarray.forEach(function (item, index) {
        st = st + index.toString() + " \"" + item + "\" at " + timearray[index].toDate().toString() + "\n"; 
    });
    commentlist.textContent = st;

    li.appendChild(reports);
    li.appendChild(num);
    li.appendChild(commentlist)

    numlist.appendChild(li);
}


function renderReportsFromNum(num){
    db.collection('numbers').get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
            if (doc.data().number == num){
                rendernumbers(doc);
                return
            }      
        })      
    })
    
}

