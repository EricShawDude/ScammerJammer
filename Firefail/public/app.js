document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();

    const db = firebase.firestore();

    const post = db.collection('posts').doc('NidiTWuMgVtrcA3TxHRq');

    post.onSnapshot( doc => {

        const data = doc.data();

        document.write(data.title + `<br>`)

        document.write(data.time.toDate() + `<br>`)

    })

            
})

