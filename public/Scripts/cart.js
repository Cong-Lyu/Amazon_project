import {getProducts} from './products.js'
let cartUrl = 'http://localhost:5000/api/cart'; //we should put the Id of that specific record which match the conditions we set before in the findProductInCartTable() at the end of this URL if we wanna update.

export async function deleteItemInCart(userInfo, productObjectId) {
  const itemRecord = await findProductInCartTable(0, userInfo['userId'], productObjectId, userInfo['userToken']);
  const response = await fetch(`${cartUrl}/${itemRecord[0]['objectId']}`, {
    method: 'DELETE',
    headers: {
      'user-token': userInfo['userToken']
    }
  }) 
  if(response.ok) {
    alert('You have deleted this item!');
  }
}

export async function findProductInCartTable(conditionType, userId, productId, userToken) {
  let condition;
  if(conditionType === 0){
    condition = `userObjectId=${userId}&productObjectId=${productId}`;
  }
  else {
    condition = `userObjectId=${userId}`;
  }
  const response = await fetch(`${cartUrl}?${condition}`, {
    method: 'GET',
    headers: {
      'user-token': userToken
    }
  });
  const result = await response.json(); //if there is no matching, it returns an empty list [].
  return result;
}

export async function postProductToCart(fetchMethod, recordObject, userToken) {
  console.log(recordObject)
  let updateUrl;
  if(fetchMethod === 'POST') {
    updateUrl = cartUrl;
  }
  else if(fetchMethod === 'PUT') {
    updateUrl = `${cartUrl}/${recordObject.objectId}`;
  }
  else {
    return 'Something wrong with the input fetch method!!!';
  }
  const response = await fetch(updateUrl, {
    method: fetchMethod,
    headers: {
      'Content-Type': 'application/json',
      'user-token': userToken
    },
    body: JSON.stringify(recordObject)
  });
  const result = await response.json(); //if there is no matching, it returns an empty list [].
}

export async function sumCartItems(userInfo, itemList) {
  let sumQuantity = 0;
  let sumPriceCents = 0;
  const products = await getProducts(userInfo);
  for(const item of itemList) {
    sumQuantity += item.productQuantity;
    const indexInProducts = products.findIndex(target => target.objectId === item.productObjectId);
    sumPriceCents += products[indexInProducts].productPriceCents * item.productQuantity;
  }
  const sumPrice = String((sumPriceCents / 100).toFixed(2));
  return [sumQuantity, sumPrice];
}