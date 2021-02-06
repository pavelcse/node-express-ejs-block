window.onload = function () {
    // Like Dislike
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');

    likeBtn.addEventListener('click', function(e) {
        let postId = likeBtn.dataset.post;
        reqLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'Liked ' : 'Like ';
                likeText = likeText + `( ${data.totalLikes} )`;
                let dislikeText = `Dislike ( ${data.totalDislikes} )`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.error(e);
                alert(e.response.data.error)
            })
    });

    dislikeBtn.addEventListener('click', function(e) {
        let postId = dislikeBtn.dataset.post;
        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'Disliked ' : 'Dislike ';
                dislikeText = dislikeText + `( ${data.totalDislikes} )`;

                let likeText = `Like ( ${data.totalLikes} )`

                dislikeBtn.innerHTML = dislikeText
                likeBtn.innerHTML = likeText
            })
            .catch(e => {
                console.error(e);
                alert(e.response.data.error)
            })
    });

    // Bookmarks
    const bookmarks = document.getElementsByClassName('bookmark');

    [...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer';
        bookmark.addEventListener('click', function(e) {
            let target = e.target.parentElement;

            let headers = new Headers();
            headers.append('Accept', 'Application/JSON');

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors'
            })

            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if(data.bookmarked) {
                        target.innerHTML = '<i class="fas fa-bookmark"></i>';
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>';
                    }
                })
                .catch(e => {
                    console.error(e.response.data);
                    alert(e.response.data.error)
                })
        });
    });

    // Comments
    const comment = document.getElementById('comment');
    const commentHolder = document.getElementById('comment-holder');

    comment.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            if(e.target.value) {
                let postId = comment.dataset.post;
                let data = {
                    body: e.target.value
                }
                let url = `/api/comments/${postId}`;
                let req = generalRequest(url, 'POST', data);
                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        let commentElement = createComment(data);
                        commentHolder.insertBefore(commentElement, commentHolder.children[0]);
                        e.target.value = '';
                        
                        document.getElementsByClassName('no-comment').innerHTML = '';
                    })
                    .catch(e => {
                        console.error(e.message);
                        alert(e.message)
                    });
            } else {
                alert('Please Enter A Valid Comment')
            }
        }
    });

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
}

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

function createComment(comment) {
    let innerHTML = `
    <img 
        src="${comment.user.profilePics}" 
        class="rounded-circle mx-3 my-3" 
        style="width: 40px" alt=""
    >
    <div class="media-body my-3">
        <p>${comment.body}</p>
        <div class="my-3 mr-2">
            <input type="text" name="reply" class="form-control form-control-sm" placeholder="Press Inter To Reply" data-comment="${comment._id}"> 
        </div>
    </div>
    `;

    let div = document.createElement('div');
    div.className = 'media border';
    div.innerHTML = innerHTML;
    return div;
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

function reqLikeDislike(type, postId) {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON');

    let req = new Request(`/api/${type}/${postId}`, {
        method: 'GET',
        headers,
        mode: 'cors'
    })

    return fetch(req);
}