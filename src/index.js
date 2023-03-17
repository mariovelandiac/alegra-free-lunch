  const p = document.querySelector("p");
  const API = "https://1dobvidpv4.execute-api.sa-east-1.amazonaws.com/alegra-test/api/kitchen/dish-queue"
  const APICAT = 'https://api.thecatapi.com/v1/images/search'
  const options = {
    method: "get",
  };
  const requestDish = document.querySelector("#button")
  requestDish.addEventListener('click', () => {
    console.log('hola')
    fetch(API, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.body)
    });
  });

