function createPlayer(name) {

    let score = 0;

    let addPoint = () => {
        score++;
    }

    let getPoints = () => {
        return score;
    }

    return { name, addPoint, getPoints };
}

