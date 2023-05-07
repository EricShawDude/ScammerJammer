db = firebase.firestore();
var username = "unknown";
//GOOGSHIT STUFF

const auth = firebase.auth();
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');


const provider = new firebase.auth.GoogleAuthProvider();
signInBtn.onclick = () => auth.signInWithPopup(provider)
signOutBtn.onclick = () => auth.signOut()

auth.onAuthStateChanged(user => {
    if (user){
        signInBtn.hidden = true;
        signOutBtn.hidden = false;
        username = user.displayName;
    }else{
        signInBtn.hidden = false;
        signOutBtn.hidden = true;
        username = "unknown";
    }
});


//PAST FORM SHIT
/*
const phonelist = document.querySelector("#phoneform");
const searchlist = document.querySelector("#searchform");
const commentlist = document.querySelector("#commentform");
//phone number submit button listener
phonelist.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('dumbshit').add({
        name: phonelist.name.value
    })
    addDocLinear(phonelist.name.value, commentlist.name.value);
})
//search button listener
searchlist.addEventListener('submit', (e) => {
    e.preventDefault();
    renderReportsFromNum(phonelist.name.value);
})

*/

/*
function pull() {
    var input = document.getElementById("searchField").value;
    document.getElementById("title").innerHTML = input;
    changePage("index.html");
}
*/ 

var pagetemp = 0
var pagetempreports = 0


function notscam(){
    db.collection('failtemp').get().then((snapshot) =>{
        document.getElementById("button_report").disabled = true;
        snapshot.docs.forEach(doc => {
            console.log("Frank won.");
            pagetemp = doc.data().temp;
            console.log(pagetemp);
            setTimeout(() => { 
                document.getElementById("searchField").value = pagetemp;
                document.getElementById('phone_number').innerHTML = pagetemp;
                
                document.getElementById("button_report").disabled = false;
                 }, 500);
            
        })      
    })
}
function scam(){
    document.getElementById("button_report").disabled = true;
    
    db.collection('failtemp').get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
            console.log("Frank told the man on the other end his credit card info. It's joever.");
            pagetemp = doc.data().temp;
            setPageTempReports();
            console.log(pagetemp);
            

            setTimeout(() => { 
            renderReportsFromNum(pagetemp);
            document.getElementById("searchField").value = pagetemp;
            document.getElementById('phone_number').innerHTML = pagetemp;
            document.getElementById('reported').innerHTML = "Reported  "+ pagetempreports + " times";
            document.getElementById("button_report").disabled = false;
            
             }, 500);
            
        })      
    })

}

function setPageTempReports(){
    db.collection('numbers').get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
            if (doc.data().number == pagetemp){
                pagetempreports = doc.data().reports;
            }      
        })
    })
}
function search(){

    var number = document.getElementById("searchField").value;
    console.log("Frank is")
    console.log(number)
    number = number.replace(/\D/g,'')
    if(number == ""){
        return;
    }else{
        document.getElementById("searchField").readOnly = true;
        document.getElementById("button_search").disabled = true;
        try {
            document.getElementById("button_report").disabled = true;
          } catch (error) {
            console.error(error);
          }
        renderReportsFromNum(number);
        //if number exists then scam
        found = false;
        db.collection('numbers').get().then((snapshot) =>{
            snapshot.docs.forEach(doc => {
                console.log("Frank waz here")
                console.log(number)
                console.log(doc.data().number)
                console.log((doc.data().number == number));
                if (doc.data().number == number){
                    console.log("number found");
                    found = true;
                    addTemp(number)
                    //😭
                    setTimeout(() => { changePage("scam.html"); }, 1000);
                    return;
                }      
            })
            if (!found){     
                addTemp(number)
                //this is so bad vvvv what if their internet dies or smth 😭
                setTimeout(() => { changePage("not_scam.html"); }, 1000);
            }
            
        })

        
        
    
    }
}
function reportdebug(num, message = "😭"){
    addDocLinear(num, message);
    return;
}
function reportinitial(){
    document.getElementById("button_report").innerHTML = "Reported 🗸";
    document.getElementById("button_report").disabled = true;
    
    
    console.log(pagetemp);
    addDocLinear(pagetemp);
}

function reportalready(){
    document.getElementById("button_report").innerHTML = "Reported 🗸";
    document.getElementById("button_report").disabled = true;
    addDocLinear(pagetemp);
}


function changePage(url) {
    window.location.href = url;
}
function addTemp(num){
    db.collection("failtemp").doc("temp").set({
        temp: num
      }).then(function() {
        console.log("Frank is temporary.");
      });
}

function addDocLinear(num, comment = "default"){
    comment = username + ":" + comment;
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



function addDocNew(num, comment = 'default'){
    console.log("gaming is a go");
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
    
    const commentarray = doc.data().comments;
    const timearray = doc.data().times; 
    st = [];
    commentarray.forEach(function (item, index) {
        st.push("#" + (index +1).toString() + " \"" + item + "\" at " + timearray[index].toDate().toString() + "\n");
    });

    let ul = document.createElement('ul');
    let li = document.createElement('li');

    document.querySelector('#numlist').appendChild(ul);

    st.forEach((item) => {
        li.innerHTML += item;

        // Add li to the ul
        ul.appendChild(li);

        // Reset the list item
        li = document.createElement('li')
    });
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

