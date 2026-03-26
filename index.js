let food = [];
let totalAmount = 0;

$(document).ready(function() {

  // Navbar Adjustment
  if ($(document).width() <= 992) {
    $('.navbar-nav').removeClass("ml-auto").addClass("mr-auto");
  } else {
    $('.navbar-nav').removeClass("mr-auto").addClass("ml-auto");
  }

  // Scroll to Top Logic
  var scrollToTopBtn = $('#scrollToTop');
  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.addClass('show');
    } else {
      scrollToTopBtn.removeClass('show');
    }
  });

  scrollToTopBtn.on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '500');
  });

  // Smooth Scrolling
  $(".navbar a, .homeBtn").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function() {
        window.location.hash = hash;
      });
    }
  });

  // Category Filtering
  $('.product-box-layout4').click(function() {
    $(this).toggleClass("productClicked").parent().siblings('div').children().removeClass("productClicked");
    let targetId = "";
    if ($(this).hasClass('momos')) targetId = '#momos';
    else if ($(this).hasClass('chinese')) targetId = '#chinese';
    else if ($(this).hasClass('beverages')) targetId = '#beverages';

    if (targetId) {
      $(targetId).show().siblings('div').hide();
      $('html, body').animate({ scrollTop: $(targetId).offset().top }, 800);
    }
  });

  // Menu Increment/Decrement
  $(".menuBtn").click(function() {
    let quantityLabel = $(this).siblings(".quantity");
    let foodName = quantityLabel.parent().siblings('div').children().first().text().trim();
    let price = Number(quantityLabel.parent().siblings('div').children().last().text());
    let count = Number(quantityLabel.text());

    if ($(this).hasClass('plus')) {
      count++;
    } else if ($(this).hasClass('minus') && count > 0) {
      count--;
    }
    
    quantityLabel.text(count);
    updateCart(foodName, count, price);
  });

  function updateCart(name, qty, price) {
    // Find if item exists
    let index = food.findIndex(item => item[0] === name);
    
    if (index > -1) {
      if (qty === 0) food.splice(index, 1);
      else food[index][1] = qty;
    } else if (qty > 0) {
      food.push([name, qty, price]);
    }

    // UI Update
    let cartDiv = $('.cartContentDiv');
    cartDiv.empty();
    totalAmount = 0;

    if (food.length > 0) {
      $('.shoppingCart').addClass('shoppingCartWithItems');
      food.forEach(item => {
        totalAmount += (item[1] * item[2]);
        cartDiv.append(`
          <div class="row cartContentRow">
            <div class="col-10">
              <p>${item[0]}</p>
              <p class="text-muted-small"><i class="fas fa-rupee-sign"></i>${item[2]}</p>
            </div>
            <div class="col-2 text-right">
              <span class="cartQuantity">${item[1]}</span>
              <p class="text-muted-small"><i class="fas fa-rupee-sign"></i>${item[1] * item[2]}</p>
            </div>
          </div><hr class="cartHr">`);
      });
    } else {
      $('.shoppingCart').removeClass('shoppingCartWithItems');
      cartDiv.append('<h1 class="text-muted">Your Cart is Empty</h1>');
    }

    $('.shoppingCartAfter').text(food.length);
    $('.totalAmountDiv').html('Total Amount: <i class="fas fa-rupee-sign"></i>' + totalAmount);
  }
});

// FIXED WHATSAPP REDIRECT
function openWhatsapp() {
  let addressField = $('#address').val();
  let noteField = $('#note').val();

  if (!addressField) {
    alert("Please Enter Address");
    return;
  }
  
  if (food.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let wTxt = '*New Order from Momo Agency*\n\n';
  wTxt += '*Item Name* - *Qty*\n';
  wTxt += '--------------------------\n';

  let finalTotal = 0;
  food.forEach(item => {
    wTxt += `${item[0]} x ${item[1]}\n`;
    finalTotal += (item[1] * item[2]);
  });

  wTxt += `\n*Total Bill: ₹${finalTotal}*`;
  wTxt += `\n\n*Delivery Address:* ${addressField}`;
  if (noteField) wTxt += `\n*Note:* ${noteField}`;

  let encodedMsg = encodeURIComponent(wTxt);
  // YOUR NUMBER UPDATED HERE
  window.open(`https://wa.me/917719077157?text=${encodedMsg}`, "_blank");
}