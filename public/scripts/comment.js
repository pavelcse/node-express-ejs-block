window.onload = function () {
    const commentHolder = document.getElementById('comment-holder');

    commentHolder.addEventListener('keypress', function(e) {
        if(commentHolder.hasChildNodes(e.target)) {
            if(e.key === 'Enter') {
                if(e.target.value) {
                    let commentId = e.target.dataset.comment;
                    let data = {
                        body: e.target.value
                    }
                    let url = `/api/comments/replies/${commentId}`;
                    let req = generalRequest(url, 'POST', data);
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let replyElement = createReply(data);
                            let parent = e.target.parentElement; // parentNode
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = '';
                        })
                        .catch(e => {
                            console.error(e.message);
                            alert(e.message)
                        });
                } else {
                    alert('Please Enter A Valid Reply')
                }
            }
        }
    })
};

function generalRequest(url, method, body) {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'application/json')

    let req = new Request(url, {
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'cors'
    });

    return req;
};

function createReply(reply) {
    let innerHTML = `
    <img 
        src="${reply.profilePics}" 
        class="rounded-circle mx-3 my-3" 
        style="width: 40px" alt=""
    >
    <div class="media-body my-3">
        <p>${reply.body}</p>
    </div>
    `;

    let div = document.createElement('div');
    div.className = 'media';
    div.innerHTML = innerHTML;
    return div;
}