export function connectToken(email, password) {

    return new Promise((callback) => {
        fetch('https://api.edu.etherial.dev/apijsv2/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(function (response) {
            response.json().then(function (json) {
                if (json['status'] === 200) {
                    callback(json)
                    localStorage.setItem('token', json['data']['token'])
                }
            })
        })
    })
}

export function getUserData() {
    return new Promise((callback) => {
        fetch('https://api.edu.etherial.dev/apijsv2/users/me', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authentication: 'Bearer Token',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(function (response) {
            response.json().then(function (json) {
                callback(json['data']['nickname'])
            })
        })
    })
}

export function getChatData() {
    return new Promise((callback) => {
        fetch('https://api.edu.etherial.dev/apijsv2/messages', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authentication: 'Bearer Token',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(function (response) {
            response.json().then(function (data) {
                callback(data)
            })
        })
    })
}

export function deleteMessage(messageId, idRegex) {
    return new Promise((callback) => {
        fetch(`https://api.edu.etherial.dev/apijsv2/messages/${messageId.match(idRegex)[1]}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authentication: 'Bearer Token',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            response.json().then((data) => {
                if (data['status'] === 200) {
                    callback(data)
                }
            })
        })
    })
}

export function sendMessage(message) {
    fetch('https://api.edu.etherial.dev/apijsv2/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            message: message.value
        })
    })
}

export function putMessage(message, idRegex) {
    fetch(`https://api.edu.etherial.dev/apijsv2/messages/${message.id.match(idRegex)[1]}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authentication: 'Bearer Token',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            message: message.value
        })
    })
}