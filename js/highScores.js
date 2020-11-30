window.onload = function () {
    const highScoresList = document.querySelector('#highScoresList')
    let jsonObj = localStorage.getItem('highScores')

    //check if there is data with the key todoList in the local storage
    if (jsonObj != null) {
        let highScores = JSON.parse(jsonObj)
        highScoresList.innerHTML = highScores
            .map(score => {
                return `<li class="high-score">
                <span class="namePlayer">${score.name}</span>  
                <span class="scorePlayer">${score.score}</span>
                <span class="badge"><i class="fas fa-trophy"></i></span>
                </li>`;
            })
            .join('')

    }

}