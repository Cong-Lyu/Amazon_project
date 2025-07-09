const productsTableUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/products';
const userLoginUrl = 'https://supplekick-us.backendless.app/api/users/login';
const email = '433lll433@gmail.com';
const password = 'Shirahama';

async function loginWithoutLocal(loginUrl, email, password) { //Node.js does not support localStorage!!!!
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'login': email,
      'password': password
    })
  })
  const result = response.json();
  return result;
}


const productsSample1 = [{
  productId : 'sa21dk12ks1o',
  productName : 'Black and Gray Athletic',
  productRating : 45,
  productScore : '87',
  productPriceCents : 1090,
  productImageName : 'athletic-cotton-socks-6-pairs'
},{
  productId : 'sa21sa12ssao',
  productName : 'Intermediate Size Basketball',
  productRating : 40,
  productScore : '127',
  productPriceCents : 2095,
  productImageName : 'intermediate-composite-basketball'
},{
  productId : 'sa2ewwqao21w',
  productName : 'Adults Plain Cotton T-Shirt - 2 Pack',
  productRating : 45,
  productScore : '56',
  productPriceCents : 799,
  productImageName : 'adults-plain-cotton-tshirt-2-pack-teal'
},{
  productId : 'sadkiuaosada',
  productName : '2 Slot Toaster - Black',
  productRating : 50,
  productScore : '2197',
  productPriceCents : 1899,
  productImageName : 'black-2-slot-toaster'
},{
  productId : 'sad447475o22',
  productName : '6 Piece White Dinner Plate Set',
  productRating : 40,
  productScore : '37',
  productPriceCents : 2067,
  productImageName : '6-piece-white-dinner-plate-set'
},{
  productId : 'sadqw2reraod',
  productName : '6-Piece Nonstick, Carbon Steel Oven',
  productRating : 45,
  productScore : '175',
  productPriceCents : 3499,
  productImageName : '6-piece-non-stick-baking-set'
}];  //for the initial period when there was no backend only.

const productsSample2 = [{
  productName : 'Black and Gray Athletic',
  productRating : 45,
  productScore : '87',
  productPriceCents : 1090,
  productImageName : 'athletic-cotton-socks-6-pairs'
},{
  productName : 'Intermediate Size Basketball',
  productRating : 40,
  productScore : '127',
  productPriceCents : 2095,
  productImageName : 'intermediate-composite-basketball'
},{
  productName : 'Adults Plain Cotton T-Shirt - 2 Pack',
  productRating : 45,
  productScore : '56',
  productPriceCents : 799,
  productImageName : 'adults-plain-cotton-tshirt-2-pack-teal'
},{
  productName : '2 Slot Toaster - Black',
  productRating : 50,
  productScore : '2197',
  productPriceCents : 1899,
  productImageName : 'black-2-slot-toaster'
},{
  productName : '6 Piece White Dinner Plate Set',
  productRating : 40,
  productScore : '37',
  productPriceCents : 2067,
  productImageName : '6-piece-white-dinner-plate-set'
},{
  productName : '6-Piece Nonstick, Carbon Steel Oven',
  productRating : 45,
  productScore : '175',
  productPriceCents : 3499,
  productImageName : '6-piece-non-stick-baking-set'
}];  //for backend: "backendless" test use

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function upLoadProducts(productsList) { //Node.js does not support localStorage!!!!
  const userInfo = await loginWithoutLocal(userLoginUrl, email, password);
  const userToken = userInfo['user-token'];
  for(const product of productsList) {
    console.log(product);
    const response = await fetch(productsTableUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'user-token': userToken
      },
      body: JSON.stringify(product)
    })
    const result = await response.json();
    console.log(result);
    await sleep(1200);
  }
}
//upLoadProducts(productsSample);   //Node.js does not support localStorage!!!!

export async function getProducts(userInfo) {
  const response = await fetch(productsTableUrl);
  const productsList = await response.json();
  return productsList;
}

