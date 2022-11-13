/* INTRO by Brad from Traversy Media
AXIOS is an HTTP library or an HTTP client to make requests to either your own back-end or third party API to fetch data and it's similar to the fetch API which is built into the browser but I prefer it because I think it's more powerful and I like the syntax better so that's what I use if I'm building a react full-stack react or view app or vanilla JavaScript and I need to communicate with my back-end. You can also use it with nodejs. */

/* AXIOS GLOBALS
With Global's you can send a header value with every request and where this comes in handy is with tokens, authentication tokens. So, I just showed you how to add a token to a custom header, like this, putting it in the config and then passing it into into the request. Now, what if you have a whole bunch of protected routes? You don't want to do this for every single one, so what you could do is create a global for token.
*/
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// GET REQUEST
function getTodos() {
  /*
  axios({
    method: 'get',
    url: 'http://jsonplaceholder.typicode.com/todos',
    params: {
      _limit: 5
    }
  })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  */

  // Short way of doing the same thing
  axios
    .get('http://jsonplaceholder.typicode.com/todos?_limit=5', { timeout: 5000 }) // here, timeout is a property which stops the request if it takes more than 5sec
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// POST REQUEST
function addTodo() {
  /*
    axios({
    method: 'post',
    url: 'http://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'New Todo',
      completed: false
    }
  })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  */

  // Short way of doing the same thing
  axios
    .post('http://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// PUT/PATCH REQUEST (here, we need to include the ID in the URL)
function updateTodo() {
  // PUT (to replace the entire resource)
  axios
    .put('http://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));

  /* PATCH (updates only the specified parts of the resource) 
  axios
    .patch('http://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  */
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete('http://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// SIMULTANEOUS DATA (Making Simultaneous Requests)
function getData() {
  /* 
    axios.all([
    axios.get('http://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('http://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
    .then(res => {
      console.log(res[0]);
      console.log(res[1]);
      showOutput(res[1]);
    })
    .catch(err => console.log(err))
  */

  // Short way to do the same thing
  axios.all([
    axios.get('http://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('http://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch(err => console.log(err))
}

/* What YouTuber says before explaining custom headers?
A lot of times you'll have to send data in the headers. A good example of this is when you have authentication with like JSON web tokens. You might make a request to login, you validate your login, and then you get back a token, and then you have to send that token in the header to access the protected routes.
*/

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometoken'
    }
  }

  axios
    .post('http://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    }, config)
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
// NOTE: In this example we have only tranformed response, but we can also transform requests.
function transformResponse() {
  const options = {
    method: 'post',
    url: 'http://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World'
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get('http://jsonplaceholder.typicode.com/todoss?_limit=5', {
      validateStatus: function (status) {
        return status < 500; // Rejects only if status is greater than or equal to 500. So now, even though this url is wrong and it's gonna be a 404 error, but the catch block will not run
      } // here, validateStatus is a property to limit catch block to a certain status
    })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // This means thaa the server reponded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if (err.response.status === 404) {
          alert('Error: Page Not Found');
        }
      } else if (err.request) {
        // This means that the request was made but there is no response
        console.error(err.request);
      } else {
        console.error(err.message);
      }
    });
}

// CANCEL TOKEN (to cancel requests on the fly)
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get('http://jsonplaceholder.typicode.com/todos?_limit=5', {
      cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('Request Cancelled', thrown.message);
      }
    })
  if (true) {
    source.cancel('Request Cancelled!');
  }
}

/* YouTuber Talks Something Important
Interceptors allow us to basically run some kind of functionality. We can intercept the request and run some kind of functionality, for example a logger. So that's what I want to do, i.e. create a little logger for any requests that we make.

Below is the syntax to create interceptors. Inside the parentheses we pass a function which takes config as a parameter which provides us access to anything in the config such as the method, the URL, etc.
*/

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use((config) => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date()}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// AXIOS INSTANCES
const axiosInstance = axios.create({
  // Other Custom Settings
  baseURL: 'http://jsonplaceholder.typicode.com'
});
// axiosInstance.get('/comments?_limit=5').then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);