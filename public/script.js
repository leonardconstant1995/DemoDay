document.querySelector('#form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let input = document.querySelector("#room-input").value

    fetch(`/joinRoom/${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      window.open(`/joinRoom/${input}`, "_self")
})