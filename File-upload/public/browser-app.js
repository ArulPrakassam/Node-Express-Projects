const url = "/api/v1/products";
const fileFormDOM = document.querySelector(".file-form");
const responseText = document.querySelector(".err-text");
const nameInputDOM = document.querySelector("#name");
const priceInputDOM = document.querySelector("#price");
const imageInputDOM = document.querySelector("#image");

const containerDOM = document.querySelector(".container");
let imageValue;

imageInputDOM.addEventListener("change", async (e) => {
  const imageFile = e.target.files[0];
  const formData = new FormData();
  formData.append("image", imageFile);
  try {
    const {
      data: {
        image: { src },
      },
    } = await axios.post(`${url}/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    imageValue = src;
  } catch (error) {
    imageValue = null;
    responseText.style.display = "block";
    responseText.innerHTML = `${error.response.data.msg}`;
    setTimeout(() => {
      responseText.style.display = "none";
    }, 2000);
  }
});

fileFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameValue = nameInputDOM.value;
  const priceValue = priceInputDOM.value;
  try {
    const product = { name: nameValue, price: priceValue, image: imageValue };

    const { data } = await axios.post(url, product);
    responseText.style.display = "block";
    responseText.innerHTML = `${data.msg}`;
    setTimeout(() => {
      responseText.style.display = "none";
    }, 2000);
    fetchProducts();
  } catch (error) {
    responseText.style.display = "block";
    responseText.innerHTML = `${error.response.data.msg}`;
    setTimeout(() => {
      responseText.style.display = "none";
    }, 2000);
  }
});

async function fetchProducts() {
  try {
    const {
      data: { products },
    } = await axios.get(url);

    const productsDOM = products
      .map((product) => {
        return `<article class="product">
              <img src="${product.image}" alt="${product.name}" class="img"/>
              <footer>
              <p>${product.name}</p>
              <span>$${product.price}</span>
              </footer>
              </article>`;
      })
      .join("");
    containerDOM.innerHTML = productsDOM;
  } catch (error) {
    console.log(error);
  }
}

fetchProducts();
