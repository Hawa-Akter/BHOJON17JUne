const { ipcRenderer } = require("electron");

const categoryUl = document.getElementById("category_item");
const foodList = document.getElementById("foods");
const foodByAllCategory = document.getElementById("allCategory");
const cartData = document.getElementById("items_cart");
const cartTable = document.getElementById("itemsOnCart");
const cartImage = document.getElementById("myImg");
const itemsCart = document.querySelector("#items_cart");

//different tabs
function pos(evt, posSytem) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(posSytem).style.display = "block";
  evt.currentTarget.className += " active";
}

function removeCartItem(id) {
  var fID = id;
  var trs = document.querySelectorAll("#items_cart tr");
  trs.forEach((tr) => {
    if (tr.id == fID) {
      tr.remove();
    }
  });
}

function updatePriceOnCart(e) {
  var quantity = e.target.value;
  var price = e.target.parentElement.previousElementSibling.textContent;
  var subTotal = quantity * price;
  var total = e.target.parentElement.nextElementSibling;
  total.textContent = subTotal;
}

//Foods  on cart
ipcRenderer.on("ItemsOnBasketSent", (e, items) => {
  cartImage.style.display = "none";
  cartTable.style.display = "block";
  let data = items;
  cartData.innerHTML = "";
  var tr = "";
  var tr2 = "";
  data.map((x) => {
    var addOnItems = x.addonItems;
    tr += `<tr id="${x.foodVarients[0].foodId}" class="food_row">
           <td>${x.foodVarients[0].itemName}</td><td>${x.foodVarients[0].varient}</td><td id="cart_price">${x.foodVarients[0].foodPrice}</td><td><input id="quantity_input" class="cart-quantity-input" value="${x.foodVarients[0].quantity}" type="number" min="1" style="width: 5em; border: 1px solid black;"onchange="javascript:updatePriceOnCart(event);"></td><td id="total_price">${x.foodVarients[0].foodTotal}</td><td><input id="remove_cart_item" class="cart-quantity" type="button" value="X" onclick=removeCartItem(${x.foodVarients[0].foodId})
   ></td>
          </tr>`;
    cartData.innerHTML += tr;
    addOnItems.map((addOnItem) => {
      tr2 += `<tr id="${addOnItem.foodId}">
          <td>${addOnItem.addOnName}</td><td></td><td>${addOnItem.price}</td><td>${addOnItem.addsOnquantity}</td><td>${addOnItem.addOntotal}</td><td></td>
         </tr>`;
      cartData.innerHTML = tr + tr2;
    });

    const allTrFromCart = [...itemsCart.querySelectorAll("tr")];

    allTrFromCart.map((item) => {
      console.log(" iD of TR from cart", item.getAttribute("id"));
    });

    console.log(itemsCart.querySelectorAll("tr"));
    //var tr = document.createElement("tr")
    // tr.id = x.foodVarients[0].foodId;
    // tr.className = "food_row";
    // var itemName = document.createElement("td");
    // itemName.textContent = x.foodVarients[0].itemName;

    // var varient = document.createElement("td");
    // varient.textContent = x.foodVarients[0].varient;

    // var price = document.createElement("td");
    // price.id = "cart_price";
    // price.textContent = x.foodVarients[0].foodPrice;

    // var qty = document.createElement("td");
    // var inpt = document.createElement("input");
    // inpt.id = "quantity_input";
    // inpt.classList.add("cart-quantity-input");
    // inpt.type = "number";
    // inpt.value = x.foodVarients[0].quantity;
    // inpt.min = "1";
    // inpt.onchange = (e) => updatePriceOnCart(e);
    // inpt.style.width = "5em";
    // inpt.style.border = "1px solid black";
    // qty.appendChild(inpt);

    // var total = document.createElement("td");
    // total.id = "total_price";
    // total.textContent = x.foodVarients[0].foodTotal;

    // var remove = document.createElement("td");
    // var input = document.createElement("input");
    // input.id = "remove_cart_item";
    // input.classList.add("cart-quantity");
    // input.type = "button";
    // input.value = "X";
    // //input.onclick = (e) => removeCartItem(e);
    // input.onclick = (e) => removeCartItem(e, x.foodVarients[0].foodId);

    // remove.appendChild(input);

    // tr.append(itemName, varient, price, qty, total, remove);

    // var trV;
    // addOnItems.map((addOnItem) => {
    //   trV = document.createElement("tr");
    //   trV.id = addOnItem.foodId;

    //   var addOnName = document.createElement("td");
    //   addOnName.textContent = addOnItem.addOnName;

    //   var emp = document.createElement("td");
    //   emp.textContent = "";

    //   var priceVarient = document.createElement("td");
    //   priceVarient.textContent = addOnItem.price;

    //   var qtyV = document.createElement("td");
    //   qtyV.textContent = addOnItem.addsOnquantity;

    //   var totalV = document.createElement("td");
    //   totalV.textContent = addOnItem.addOntotal;

    //   var removeV = document.createElement("td");
    //   removeV.textContent = "";

    //   trV.append(addOnName, emp, priceVarient, qtyV, totalV, removeV);
    //   cartData.append(trV);
    // });
  });
});

function getFoodId(id) {
  ipcRenderer.send("foodIdSent", id);
}

//sending category id to fetch foods by specific category
function getCategoryId(id) {
  ipcRenderer.send("categoryId", id);
}

//creating dynamic category on pos page
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("categoryNamesLoaded");
});

ipcRenderer.on("categoryNamesReplySent", function (event, results) {
  results.forEach(function (result) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.textContent = result.name;
    li.appendChild(a);
    li.onclick = () => getCategoryId(result.id);
    categoryUl.appendChild(li);
  });
});
//end of dynamic category on pos page

// displaying food by category
ipcRenderer.on("foodsByCategoryReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";

  foods.forEach((food) => {
    div += `
    <div class=" col-lg-3 col-sm-4 col-6">
    <div class="card">
    <img src="${food.product_image}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><p><a href="#"  style="text-decoration:none; color:black;" id=${food.id} onclick = {getFoodId(${food.id})}>
      ${food.product_name}
        </a></p>
      </div>
      </div>
    </div>`;
  });

  foodList.innerHTML += div;
});

// displaying food by all  category
foodByAllCategory.addEventListener("click", () => {
  ipcRenderer.send("foodByALlCategory");
});
ipcRenderer.on("foodsByAllCategoryReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";
  foods.forEach((food) => {
    div += `
    <div class="col-lg-3 col-sm-4 col-6">
    <div class="card">
    <img src="${food.product_image}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><p><a href="#"  style="text-decoration:none; color:black;" id=${food.id} onclick = {getFoodId(${food.id})}>
      ${food.product_name}
        </a></p>
      </div>
      </div>
    </div>`;
  });
  foodList.innerHTML += div;
});
// end of displaying food by all category

// displaying the foods when the page loaded
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodOnPageLoaded");
});
ipcRenderer.on("foodOnPageLoadedReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";
  foods.forEach((food) => {
    div += `
    <div class=" col-lg-3 col-sm-4 col-6" >
    <div class="card">
    <img src="${food.product_image}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><p><a href="#"  style="text-decoration:none; color:black;" id=${food.id} onclick = {getFoodId(${food.id})}>
      ${food.product_name}
        </a></p>
      </div>
      </div>
    </div>`;
  });
  foodList.innerHTML += div;
});
