(async () => {
  const requestDish = document.querySelector("#make-dish");
  const API = "alegra-test-alb-1929991448.sa-east-1.elb.amazonaws.com/api";
  const options = {
    method: 'GET',
    mode: "no-cors",
  }
  requestDish.addEventListener('click', async () => {
    const response = await fetch(`${API}/kitchen/make-dish`, options);
    const data = await response.json();
    requestDish.innerHTML = data.toString()
  })
})()
