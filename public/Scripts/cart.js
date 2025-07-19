let cartUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/cart'; //we should put the Id of that specific record which match the conditions we set before in the findProductInCartTable() at the end of this URL if we wanna update.

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