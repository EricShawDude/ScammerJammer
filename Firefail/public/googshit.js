function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
            document.write(`You should treat yourself now! ${user.displayName}`);
            console.log(user)
        })
        .catch(console.log)
}