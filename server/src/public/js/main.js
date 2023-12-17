(function($) {
	"use strict"
	var pathname = window.location.pathname
	if (pathname == '/')
	{
		// Mobile Nav toggle
		$('.menu-toggle > a').on('click', function (e) {
			e.preventDefault();
			$('#responsive-nav').toggleClass('active');
		})

		// Fix cart dropdown from closing
		$('.cart-dropdown').on('click', function (e) {
			e.stopPropagation();
		});

		/////////////////////////////////////////

		// Products Slick
		$('.products-slick#Laptop').each(function() {
			var $this = $(this),
					$nav = $this.attr('data-nav');

			$this.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: true,
				initialSlide : 0,
				infinite: true,
				speed: 500,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				responsive: [{
					breakpoint: 991,
					settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					}
				},
			{
				breakpoint: 480,
				settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				}
			},
			]
			});
		});

		$('.products-slick#Phone').each(function() {
			var $this = $(this),
					$nav = $this.attr('data-nav');

			$this.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: true,
				initialSlide : 0,
				infinite: true,
				speed: 500,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				responsive: [{
					breakpoint: 991,
					settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					}
				},
			{
				breakpoint: 480,
				settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				}
			},
			]
			});
		});

		$('.products-slick#Camera').each(function() {
			var $this = $(this),
					$nav = $this.attr('data-nav');

			$this.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: true,
				initialSlide: 0,
				infinite: true,
				speed: 500,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				responsive: [{
					breakpoint: 991,
					settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					}
				},
			{
				breakpoint: 480,
				settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				}
			},
			]
			});
		});

		// Products Widget Slick
		$('.products-widget-slick').each(function() {
			var $this = $(this),
					$nav = $this.attr('data-nav');

			$this.slick({
				infinite: true,
				autoplay: true,
				speed: 500,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
			});
		});

		/////////////////////////////////////////

		// Product Main img Slick
		$('#product-main-img').slick({
			infinite: true,
			speed: 500,
			dots: false,
			arrows: true,
			fade: true,
			asNavFor: '#product-imgs',
		});

		// Product imgs Slick
		$('#product-imgs').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			arrows: true,
			centerMode: true,
			focusOnSelect: true,
				centerPadding: 0,
				vertical: true,
			asNavFor: '#product-main-img',
				responsive: [{
				breakpoint: 991,
				settings: {
					vertical: false,
					arrows: false,
					dots: true,
				}
			},
			]
		});

		// Product img zoom
		var zoomMainProduct = document.getElementById('product-main-img');
		if (zoomMainProduct) {
			$('#product-main-img .product-preview').zoom();
		}

		/////////////////////////////////////////

		// var priceInputMax = document.getElementById('price-max'),
		// 		priceInputMin = document.getElementById('price-min');

		// priceInputMax.addEventListener('change', function(){
		// 	updatePriceSlider($(this).parent() , this.value)
		// });

		// priceInputMin.addEventListener('change', function(){
		// 	updatePriceSlider($(this).parent() , this.value)
		// });

		// function updatePriceSlider(elem , value) {
		// 	if ( elem.hasClass('price-min') ) {
		// 		console.log('min')
		// 		priceSlider.noUiSlider.set([value, null]);
		// 	} else if ( elem.hasClass('price-max')) {
		// 		console.log('max')
		// 		priceSlider.noUiSlider.set([null, value]);
		// 	}
		// }

		// Price Slider
		var priceSlider = document.getElementById('price-slider');
		if (priceSlider) {
			noUiSlider.create(priceSlider, {
				start: [1, 999],
				connect: true,
				step: 1,
				range: {
					'min': 1,
					'max': 999
				}
			});

			priceSlider.noUiSlider.on('update', function( values, handle ) {
				var value = values[handle];
				handle ? priceInputMax.value = value : priceInputMin.value = value
			});
		}

		var nextTabName
		$("ul.section-tab-nav.tab-nav").on('shown.bs.tab',function(e) {
			
			nextTabName = $(e.target).data('name')
			let previousTabName = $(e.relatedTarget).data('name')

			$('.tab-pane').removeClass("active");
			// $(`div#${previousTabName}.tab-pane > div.products-slick`).remove()
			$(`div#${nextTabName}.tab-pane`).addClass('active')

			if($(`div#${nextTabName}.tab-pane`).hasClass('active'))
			{
				$(`div#${nextTabName}.products-slick`).slick("slickGoTo", 0);
			}

			function jumpBack() {
				setTimeout(function() {
					$('.products-slick').slick("slickGoTo", 0);
				}, 3000);
			}
			
			$('.products-slick').on("afterChange", function(event, slick, currentSlide, nextSlide) {
				if (currentSlide === 4) {
				jumpBack();
				}
			});

			// if(nextTabName){
			// 	$(`div#${nextTabName}.tab-pane`).on('click',function(e){
			// 		let add =  $(e.target).find('div.product.slick-slide > button.add-to-cart-btn')
			// 		add.one('click',function(e){
			// 			console.log(e.target).data()
			// 			if($(e.target).data())
			// 			{
			// 				var productName = $(e.target).data('productname')
			// 				var productPrice = $(e.target).data('productprice')
			// 				var productNumber = $(e.target).data('productnumber')
			// 				console.log(productName,productPrice,productNumber)
			// 				$.ajax({ 
			// 					type: "POST", 
			// 					url: '/user/check-out', 
			// 					async: true,
			// 					data: {"productName":productName,"productPrice":productPrice,"productNumber":productNumber}, 
			// 					cache: false,
			// 					success: function(data){
			// 					}
			// 				})
			// 				productName = ''
			// 				productPrice = ''
			// 				productNumber = ''
			// 			}
			// 			e.stopImmediatePropagation();
			// 			return false;
			// 		})
			// 	})
			// }
			nextTabName = ''
		})
		if(!nextTabName)
		{
			$(document).on('click','button.add-to-cart-btn',function(e){
				quickAddCart($(e.target))
				e.preventDefault()
			})
		}

		let dropdownList = $('.cart-list')
		if(dropdownList.length)
		{
			dropdownList.scrollTop(0)
		}
	}
	else if(pathname.split('/').slice(1)[0])
	{
		// Fix cart dropdown from closing
		$('.cart-dropdown').on('click', function (e) {
			e.stopPropagation();
		});

		// Product img zoom
		var zoomMainProduct = document.getElementById('product-main-img');
		if (zoomMainProduct) {
			$('#product-main-img .product-preview').zoom();
		}

		// Input number
		$("#input-quatity").keypress(function (evt) {
			evt.preventDefault();
		});
		$('.input-number').each(function() {
			var $this = $(this),
			$input = $this.find('input[type="number"]'),
			up = $this.find('.qty-up'),
			down = $this.find('.qty-down');

			down.on('click', function () {
				var value = parseInt($input.val()) - 1;
				value = value < 1 ? 1 : value;
				$input.val(value);
				$input.change();
			})
	
			up.on('click', function () {
				var value = parseInt($input.val(), 10);
				value = isNaN(value) ? 0 : value;
				value++;
				$input.val(value);
				$input.change();
			})
		});

		$('.add-to-cart-btn#infor-product').on('click', function() {
			var qty = $('.input-number').find('input[type="number"]').val()
			var stock = $('.product-stock').text()
			var number = parseInt(stock) - parseInt(qty)
			var name = $('h2.product-name').text() 

			if(number < 0)
			{	
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Insufficient quantity in stock!
				`).fadeIn().delay(2000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else
			{
				$.ajax({ 
					type: "POST", 
					url: window.location.href, 
					data: {"productName":name,"productNumber":qty,"stockNumberLeft":number}, 
					cache: false,
					success: function(data){
						if(data.code === '3')
						{
							$('.alert-dismissible').addClass('alert-success')
							$('.alert-dismissible').show()
							$('.alert-dismissible').html(`
								<strong>Success</strong> Add to your cart
							`).delay(2000).fadeOut(function() {
								$('.alert-dismissible').removeClass('alert-success')
								$(this).empty(); 
							});
							var arr = data.cart.map(c =>{
								$('#cart-list-dropdown').prepend(`
								<div class="product-widget">
										<div class="product-img">
											<img src="${c.productImage.path}" alt="">
										</div>
										<div class="product-body">
											<h3 id="product-name-dropdown" class="product-name"><a href="/product/${c.productName}">${c.productName}</a></h3>
											<h4 id="product-price-dropdown" class="product-price"><span id="qty-dropdown" class="qty">${c.productNumber}x</span>${addDos(c.productPrice)}</h4>
										</div>
										<button id="delete-product-cart" class="delete" onclick="triggerClick(this)">
											<i id="delete-product-icon" class="fa fa-close"></i>
										</button>
									</div>
								`)
								$('#list-cart-dropdown').append(`
									<div class="qty" id="qty-dropdown">${c.productNumber}</div>
								`)
								$('#cart-summary-totalNumber').text(`${c.productNumber} Item(s) selected`)
								$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(c.productPrice)}`)
							})
						}
						else if(data.code === '4')
						{
							$('.alert-dismissible').addClass('alert-success')
							$('.alert-dismissible').show()
							$('.alert-dismissible').html(`
								<strong>Success</strong> Add to your cart
							`).delay(2000).fadeOut(function() {
								$('.alert-dismissible').removeClass('alert-success')
								$(this).empty(); 
							});
							let infoProduct = $('div.product-body').find(`h3#product-name-dropdown:contains(${data.productName})`)
							if(infoProduct.length > 0)
							{
								infoProduct.next().find('span#qty-dropdown').text(`${data.productNumber}x`)
							}
							$('#qty-dropdown').text(`${data.totalNumber}`)
							$('#cart-summary-totalNumber').text(`${data.totalNumber} Item(s) selected`)
							$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(data.totalPrice)}`)
						}
						else if(data.code === '5')
						{
							$('.alert-dismissible').addClass('alert-success')
							$('.alert-dismissible').show()
							$('.alert-dismissible').html(`
								<strong>Success</strong> Add to your cart
							`).delay(2000).fadeOut(function() {
								$('.alert-dismissible').removeClass('alert-success')
								$(this).empty(); 
							});
							$('#cart-list-dropdown').append(`
								<div class="product-widget">
									<div class="product-img">
										<img src="${data.newCart.productImage.path}" alt="">
									</div>
									<div class="product-body">
										<h3 id="product-name-dropdown" class="product-name"><a href="/product/${data.newCart.productName}">${data.newCart.productName}</a></h3>
										<h4 id="product-price-dropdown" class="product-price"><span id="qty-dropdown" class="qty">${data.newCart.productNumber}x</span>${addDos(data.newCart.productPrice)}</h4>
									</div>
									<button id="delete-product-cart" class="delete" onclick="triggerClick(this)">
										<i id="delete-product-icon" class="fa fa-close"></i>
									</button>
								</div>
							`)
							if($('a#list-cart-dropdown >div#qty-dropdown').length)
							{
								$('#qty-dropdown').text(`${data.totalNumber}`)
							}
							else
							{
								$('#list-cart-dropdown').append(`
									<div class="qty" id="qty-dropdown">${data.totalNumber}</div>
								`)
							}
							$('#cart-summary-totalNumber').text(`${data.totalNumber} Item(s) selected`)
							$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(data.totalPrice)}`)
						}
						else if(data.code === '0')
						{
							$('.alert-dismissible').addClass('alert-danger')
							$('.alert-dismissible').show()
							$('.alert-dismissible').html(`
								<strong>Error</strong> ${data.message} 
								<a href="/user/login">Click here</a>
							`).fadeIn().delay(3000).fadeOut(function() {
								$('.alert-dismissible').removeClass('alert-danger')
								$(this).empty(); 
							});
						}
						else
						{
							$('.alert-dismissible').addClass('alert-danger')
							$('.alert-dismissible').show()
							$('.alert-dismissible').html(`
								<strong>Error</strong> ${data.message}
							`).delay(3000).fadeOut(function() {
								$('.alert-dismissible').removeClass('alert-danger')
								$(this).empty(); 
							});
						}
					}
				})
			}
		})

		$(document).on('click','button.add-to-cart-btn#store-list',function(e){
			quickAddCart($(e.target))
			e.preventDefault()
		})

		$('#cityBill').prop('selectedIndex',0)

		if($('.terms-checkout').length)
		{
			$('.terms-checkout').attr('checked',false)
		}

		$('input:radio[name="payment"]').attr('checked',false)


		function resetRating() {
			// Lấy đối tượng div chứa phần tử input-rating
			var ratingContainer = document.getElementById("rating-container");
			if(ratingContainer)
			{
				var review = document.getElementById('review-input');
				// Lấy tất cả các phần tử input radio trong div chứa phần tử input-rating
				var stars = ratingContainer.querySelectorAll('input[type="radio"]');
			
				// Lặp qua các phần tử input radio để xóa thuộc tính checked
				for (var i = 0; i < stars.length; i++) {
				stars[i].checked = false;
				}
				review.value = ''
			}
		  }
		  
		  // Gọi hàm resetRating khi trang được tải lại hoặc reset
		window.addEventListener("load", resetRating);

		$('#review-form-user').submit(function(e){
			e.preventDefault()
			var name = $('h2.product-name').text() 
			var review = $('#review-input')
			var ratingContainer = document.getElementById("rating-container");
    		var stars = ratingContainer.querySelectorAll('input[type="radio"]');
			var rating;
			// Duyệt qua các phần tử input radio để tìm phần tử có thuộc tính checked
			for (var i = 0; i < stars.length; i++) {
			if (stars[i].checked) {
				// Lấy giá trị value của phần tử input radio đã được chọn
				rating = stars[i].value;
				break; // Thoát khỏi vòng lặp sau khi tìm thấy phần tử đã chọn
			}
			}

			$.ajax({ 
				type: "POST", 
				url: window.location.href, 
				data: {"productName":name,'rating':rating,"postReview":review.val()}, 
				cache: false,
				success: function(data){
					if(data.code === '10')
					{
						// Không có lỗi, cho phép page load
						$(this).unbind('submit').submit();
						for (var i = 0; i < stars.length; i++) {
							stars[i].checked = false;
						}
						review.val('')
						$('#row-list-review').html("")
						data.listReviewSlice.map(p =>{
							$('#row-list-review').append(`
								<li>
									<div class="review-heading">
										<h5 class="name">${p.userReview}</h5>
										<p class="date">${p.date}</p>
										<div class="review-rating">
											${addNoneStar(p.rating)}
										</div>
									</div>
									<div class="review-body">
										<p>${p.reviewPost}</p>
									</div>
								</li>
							`)
						})
						let nextpages = 1
						let totalPages = data.totalPages
						$('ul#pagination-review').html("")
						$('ul#pagination-review').find('li.arrow-pagination').remove()
						for(var i = 0;i < data.totalPages.length;i++)
						{
							if(totalPages[i] === nextpages)
							{
								$('ul#pagination-review').append(`
									<li onclick="switchPageReview(this)" class="active">${nextpages}</li>
								`)
							}
							else
							{
								if(typeof totalPages[i] !== 'number')
								{
									$('ul#pagination-review').append(`
										<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
									`)
								}
								else
								{
									$('ul#pagination-review').append(`
										<li class="" onclick="switchPageReview(this)">${totalPages[i]}</li>
									`)
								}
							}
						}
						$('ul#pagination-review').append(`
							<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
							<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
						`)
					}
					else
					{
						$('.alert-dismissible#review').addClass('alert-danger')
						$('.alert-dismissible#review').show()
						$('.alert-dismissible#review').html(`
							<strong>Error</strong> ${data.message} 
						`).fadeIn().delay(3000).fadeOut(function() {
							$('.alert-dismissible#review').removeClass('alert-danger')
							$(this).empty(); 
						});
					}
				}
			})
		})

		scrollReview()
	}
	if (window.location.hash === "#_=_"){
		// Check if the browser supports history.replaceState.
		if (history.replaceState) {
	
			// Keep the exact URL up to the hash.
			var cleanHref = window.location.href.split("#")[0];
	
			// Replace the URL in the address bar without messing with the back button.
			history.replaceState(null, null, cleanHref);
	
		} else {
	
			// Well, you're on an old browser, we can get rid of the _=_ but not the #.
			window.location.hash = "";
	
		}
	
	}
})(jQuery);

window.addEventListener('load', function () {
	var listType = []
	var priceMax
	var priceMin
	var state
	var sortBy
	var perPage
	var currentpages = $('ul#pagination-product > li.active').text()
	$("#type-product input[type=checkbox]").prop( "checked", false );
	$("#type-product input[type=checkbox]").change(function() { 
		if($(this).is(":checked")) { 
			var type = $(this).next().clone()    //clone the element
			.children() //select all the children
			.remove()   //remove all the children
			.end()  //again go back to selected element
			.text().trim()
			listType.push(type)
			state = 1
		} else {
			
			var type = $(this).next().clone()    //clone the element
			.children() //select all the children
			.remove()   //remove all the children
			.end()  //again go back to selected element
			.text().trim()
			listType = listType.filter(function(e) { return e !== type })
			state = 0
		}
		perPage = $("select#perPage.input-select").val()
		sortBy = $("select#sortPage.input-select").val()
		filter_product({listType,state,priceMin,priceMax,sortBy,perPage,currentpages})
	}); 
	
	$('.input-number').find('input#price-min').val("")
	$('.input-number').find('input#price-max').val("")
	$('.input-number').on('keyup', function(e) {
		var error = []
		console.log($(this).find('input#price-max').val())
		if($(this).find('input#price-min').val())
		{
			priceMin = $(this).find('input#price-min').val()
		}
		if($(this).find('input#price-max').val())
		{
			priceMax = $(this).find('input#price-max').val()
		}
		if($(this).find('input#price-max').val() == '')
		{
			error.push('Please choose price max')
			$('.alert-dismissible#filter').addClass('alert-danger')
			$('.alert-dismissible#filter').show()
			$('.alert-dismissible#filter').html(`
				<strong>Error</strong> ${error} 
			`).fadeIn().delay(3000).fadeOut(function() {
				$('.alert-dismissible#filter').removeClass('alert-danger')
				$(this).empty(); 
			});
		}
		if($(this).find('input#price-min').val() == '')
		{
			error.push('Please choose price min')
			$('.alert-dismissible#filter').addClass('alert-danger')
			$('.alert-dismissible#filter').show()
			$('.alert-dismissible#filter').html(`
				<strong>Error</strong> ${error} 
			`).fadeIn().delay(3000).fadeOut(function() {
				$('.alert-dismissible#filter').removeClass('alert-danger')
				$(this).empty(); 
			});
		}
		if(error.length == 0)
		{
			perPage = $("select#perPage.input-select").val()
			sortBy = $("select#sortPage.input-select").val()
			filter_product({listType,state,priceMin,priceMax,sortBy,perPage,currentpages})
		}
	})

	$("select#sortPage.input-select").change(function(e) {
		sortBy = e.target.value
		perPage = $("select#perPage.input-select").val()
		filter_product({listType,state,priceMin,priceMax,sortBy,perPage,currentpages})
	})

	$("select#perPage.input-select").change(function(e) {
		perPage = e.target.value
		sortBy = $("select#sortPage.input-select").val()
		filter_product({listType,state,priceMin,priceMax,sortBy,perPage,currentpages})
	})
	

	$('#searchItem').val('0')
	$("#searchItemText").val('')
	$("#searchItemText").on('input',async function(i){
		let category = $('#searchItem option:selected').text()
		let item = i.target.value
		if (item !== '') {
			try {
				searchItem({category,item})
				// Tiếp tục xử lý với kết quả products ở đây
			} catch (error) {
				console.error(error);
				// Xử lý lỗi ở đây
			}
		}
		else
		{
			$('.search-list').css('visibility', 'hidden');
			$('.search-list-dropdown').html("")
		}
	});

	scrollReview()


})

function submitSearch()
{
	$("#searchBarForm").submit(function (event) {
		event.preventDefault();
		let idx = $('#searchItem option:selected').val();
		let category = $('#searchItem option:selected').text();
		let item = $("#searchItemText").val();
		let searchInfor = {
			category: category,
			idx: idx,
			item: item
		}
		window.location.href = `/search?item=${item}&category=${category}&idx=${idx}`;
		// var formData = {value};
		// $.ajax({ 
		// 	type: "POST", 
		// 	url: '/search', 
		// 	async: true,
		// 	data: searchInfor,
		// 	success: function(data){
		// 		window.location.href = `/search?item=${item}&category=${category}&idx=${idx}`;
		// 	}
		// })
	});
}

function searchItem(value) {
	$.ajax({ 
		type: "POST", 
		url: '/', 
		async: true,
		data: value,
		cache: false,
		success: function(data) {
			if(data.code === '3')
			{
				console.log(data)
				$('.search-list').css('visibility', 'visible');
				$('.search-list-dropdown').html("")
				let product = data.infoProduct
				if(product.length === 0)
				{
					$('.search-list-dropdown').append(`
						<div class="product-widget">
							<h3 id="not-found" class="not-found-item">Not found products</h3>
						</div>
					`)
				}
				else
				{
					limitedProducts = product.slice(0, 2);
					let remainingProducts = product.slice(2);
					limitedProducts.map((item,idx) =>{
						$('.search-list-dropdown').append(`
							<div class="product-widget">
								<div class="product-img">
									<img src="${item.image.path}" alt="">
								</div>
								<div class="product-body">
									<h3 id="product-name-dropdown" class="product-name"><a href="/product/${item.name}">${item.name}</a></h3>
									<h4 id="product-price-dropdown" class="product-price">$${addDos(item.price)}</h4>
								</div>
							</div>
						`)
					})
					if(product.length > 2)
					{
						let idx = $('#searchItem option:selected').val();
						$('.search-list-dropdown').append(`
						<div class="product-widget">
							<h3 id="not-found" class="not-found-item">and ${remainingProducts.length} product</h3>
							<a href="/search?item=${data.keyword}&category=${data.category}&idx=${idx}" id="search-product" class="search-all-product">(More here...)</a>
						</div>
						`)
					}
				}
			}
		}
	})
}

function scrollReview()
{
	var reviewLink = document.getElementById('review-link-comment');
	var tab3Link = document.querySelector('.tab-nav li:nth-child(3) a');
    var isTab3Active = false;

	if(reviewLink != undefined)
	{
		reviewLink.addEventListener('click', function(event) {
			event.preventDefault();
	
			if (isTab3Active) {
				// Kéo xuống review-form nếu đã switch qua tab 3
				tab3Link.scrollIntoView({ behavior: 'smooth' });
			} else {
				// Chuyển sang tab 3
				tab3Link.click();
	
				// Xác định khi tab 3 đã hoàn thành hiệu ứng chuyển đổi
				tab3Link.addEventListener('transitionend', function() {
					// Kéo xuống review-form
					tab3Link.scrollIntoView({ behavior: 'smooth' });
				}, { once: true });
	
				// Đánh dấu là đã switch qua tab 3
				isTab3Active = true;
			}
		});
	}
}

function switchPage(e)
{
	var currentpages = $('ul#pagination-product > li.active')
	var nextpages = $(e)

	if(!$(e).hasClass("arrow-pagination"))
	{
		currentpages.removeClass('active')
		nextpages.addClass('active')
	}

	var currentpages = parseInt(currentpages.text().trim())
	var nextpages;
	var pageTotal = parseInt(($('ul#pagination-product > li:not(".arrow-pagination")').last()).text())
	
	if(!$(e).text() && $(e).find('i[class*="fa-angle-left"]').length)
	{
		nextpages = currentpages - 1
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-left"]').length)
	{
		nextpages = 1
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-left"]').parent().remove()
		$('ul#pagination-product').append(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-right"]').length)
	{
		nextpages = currentpages + 1
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-right"]').length)
	{
		nextpages = pageTotal
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
	}
	else
	{
		nextpages = parseInt(nextpages.text().trim())
	}

	var totalPages = paginationPage(nextpages,pageTotal)
	if(nextpages == pageTotal)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-product').append(`
					<li onclick="switchPage(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPage(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
	}
	if(nextpages > 0 && nextpages < pageTotal)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)

		for (var i = 0; i < totalPages.length; i++) {
			if (totalPages[i] === nextpages) {
				$('ul#pagination-product').append(`
				<li onclick="switchPage(this)" class="active">${nextpages}</li>
				`);
			} 
			else 
			{
				if (typeof totalPages[i] !== 'number') 
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`);
				} 
				else 
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPage(this)">${totalPages[i]}</li>
					`);
				}
			}
		}

		$('ul#pagination-product').append(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	if(nextpages == 1)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').remove()
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-product').append(`
					<li onclick="switchPage(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPage(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
		$('ul#pagination-product').append(`
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPage(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}

	var listType = []
	var priceMax
	var priceMin
	var state
	$("input:checkbox").each(function() { 
		
		if($(this).is(":checked")) { 
			var type = $(this).next().clone()    //clone the element
			.children() //select all the children
			.remove()   //remove all the children
			.end()  //again go back to selected element
			.text().trim()
			listType.push(type)
			state = 1
		} else {
			
			var type = $(this).next().clone()    //clone the element
			.children() //select all the children
			.remove()   //remove all the children
			.end()  //again go back to selected element
			.text().trim()
			listType = listType.filter(function(e) { return e !== type })
			state = 0
		}
	}); 
	
	priceMin = $('.input-number').find('input#price-min').val()

	priceMax = $('.input-number').find('input#price-max').val()

	perPage = $("select#perPage.input-select").val()
	sortBy = $("select#sortPage.input-select").val()

	$.ajax ({
		type: "POST",
		url: `/store/page/${nextpages}`,
		cache: false,
		data: { 'currentpages': currentpages-1, 'nextpages': nextpages-1,'totalpages': pageTotal,'listType':listType,
		'state':state,'priceMin':priceMin,'priceMax':priceMax,'perPage':perPage,'sortBy':sortBy
		},
		success: function(data) {
			console.log(data)
			if(data.code === '1')
			{
				$('#row-list-product').html("")
				var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
					return b.totalSold - a.totalSold;
				}) : data.listProduct.sort(function(a,b){
					return new Date(b.date) - new Date(a.date);
				})).map(p =>{
					$('#row-list-product').append(`
						<div class="col-md-4 col-xs-6">
							<div class="product">
								<div id="newItem" class="product-img">
									<img src="${p.image.path}" alt="">
									<div class="product-label">
										<span class="sale">-30%</span>
										<span class="new">NEW</span>
									</div>
								</div>
								<div class="product-body">
									<p class="product-category">${p.category}</p>
									<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
									<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
									<div class="product-rating">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
									<div class="product-btns">
										<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
										<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
										<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
									</div>
									<span class="totalSold">${p.totalSold} sold</span>
								</div>
								<div id="store-list" class="add-to-cart">
									<button class="add-to-cart-btn" data-productName="${p.name}" 
									data-productPrice="${p.price}" data-productNumber="1">
										<i class="fa fa-shopping-cart"></i> 
										add to cart
									</button>
								</div>
							</div>
						</div>
					`)
				})
			}
			else if(data.code === '2')
			{
				$('#row-list-product').html("")
				var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
					return b.totalSold - a.totalSold;
				}) : data.listProduct.sort(function(a,b){
					return new Date(b.date) - new Date(a.date);
				})).map(p =>{
					$('#row-list-product').append(`
						<div class="col-md-4 col-xs-6">
							<div class="product">
								<div id="newItem" class="product-img">
									<img src="${p.image.path}" alt="">
									<div class="product-label">
										<span class="sale">-30%</span>
										<span class="new">NEW</span>
									</div>
								</div>
								<div class="product-body">
									<p class="product-category">${p.category}</p>
									<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
									<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
									<div class="product-rating">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
									<div class="product-btns">
										<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
										<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
										<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
									</div>
									<span class="totalSold">${p.totalSold} sold</span>
								</div>
								<div class="add-to-cart">
									<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
									data-productPrice="${p.price}" data-productNumber="1">
										<i class="fa fa-shopping-cart"></i> 
										add to cart
									</button>
								</div>
							</div>
						</div>
					`)
				})
			}
			else if(data.code === '3')
			{
				$('#row-list-product').html("")
				var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
					return b.totalSold - a.totalSold;
				}) : data.listProduct.sort(function(a,b){
					return new Date(b.date) - new Date(a.date);
				})).map(p =>{
					$('#row-list-product').append(`
						<div class="col-md-4 col-xs-6">
							<div class="product">
								<div id="newItem" class="product-img">
									<img src="${p.image.path}" alt="">
									<div class="product-label">
										<span class="sale">-30%</span>
										<span class="new">NEW</span>
									</div>
								</div>
								<div class="product-body">
									<p class="product-category">${p.category}</p>
									<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
									<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
									<div class="product-rating">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
									<div class="product-btns">
										<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
										<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
										<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
									</div>
									<span class="totalSold">${p.totalSold} sold</span>
								</div>
								<div class="add-to-cart">
									<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
									data-productPrice="${p.price}" data-productNumber="1">
										<i class="fa fa-shopping-cart"></i> 
										add to cart
									</button>
								</div>
							</div>
						</div>
					`)
				})
			}
			else if(data.code === '5')
			{
				$('#row-list-product').html("")
				var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
					return b.totalSold - a.totalSold;
				}) : data.listProduct.sort(function(a,b){
					return new Date(b.date) - new Date(a.date);
				})).map(p =>{
					console.log(p)
					$('#row-list-product').append(`
						<div class="col-md-4 col-xs-6">
							<div class="product">
								<div id="newItem" class="product-img">
									<img src="${p.image.path}" alt="">
									<div class="product-label">
										<span class="sale">-30%</span>
										<span class="new">NEW</span>
									</div>
								</div>
								<div class="product-body">
									<p class="product-category">${p.category}</p>
									<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
									<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
									<div class="product-rating">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
									<div class="product-btns">
										<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
										<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
										<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
									</div>
									<span class="totalSold">${p.totalSold} sold</span>
								</div>
								<div class="add-to-cart">
									<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
									data-productPrice="${p.price}" data-productNumber="1">
										<i class="fa fa-shopping-cart"></i> 
										add to cart
									</button>
								</div>
							</div>
						</div>
					`)
				})
			}
		}
	})
	return false;
}

function switchPageSearch(e)
{
	var currentpages = $('ul#pagination-product > li.active')
	var nextpages = $(e)

	if(!$(e).hasClass("arrow-pagination"))
	{
		currentpages.removeClass('active')
		nextpages.addClass('active')
	}

	var currentpages = parseInt(currentpages.text().trim())
	var nextpages;
	var pageTotal = parseInt(($('ul#pagination-product > li:not(".arrow-pagination")').last()).text())
	
	if(!$(e).text() && $(e).find('i[class*="fa-angle-left"]').length)
	{
		nextpages = currentpages - 1
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-left"]').length)
	{
		nextpages = 1
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-left"]').parent().remove()
		$('ul#pagination-product').append(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-right"]').length)
	{
		nextpages = currentpages + 1
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-right"]').length)
	{
		nextpages = pageTotal
		$(`ul#pagination-product > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-product > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
	}
	else
	{
		nextpages = parseInt(nextpages.text().trim())
	}

	var totalPages = paginationPage(nextpages,pageTotal)
	if(nextpages == pageTotal)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-product').append(`
					<li onclick="switchPageSearch(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPageSearch(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
	}
	if(nextpages > 0 && nextpages < pageTotal)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-product').prepend(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)

		for (var i = 0; i < totalPages.length; i++) {
			if (totalPages[i] === nextpages) {
				$('ul#pagination-product').append(`
				<li onclick="switchPageSearch(this)" class="active">${nextpages}</li>
				`);
			} 
			else 
			{
				if (typeof totalPages[i] !== 'number') 
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`);
				} 
				else 
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPageSearch(this)">${totalPages[i]}</li>
					`);
				}
			}
		}

		$('ul#pagination-product').append(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	if(nextpages == 1)
	{
		$('ul#pagination-product').html("")
		$('ul#pagination-product').find('li.arrow-pagination').remove()
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-product').append(`
					<li onclick="switchPageSearch(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-product').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-product').append(`
						<li class="" onclick="switchPageSearch(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
		$('ul#pagination-product').append(`
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageSearch(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}


	$.ajax ({
		type: "POST",
		url: `${window.location.href}&page=${nextpages}`,
		cache: false,
		data: { 'currentpages': currentpages-1, 'nextpages': nextpages-1,'totalpages': pageTotal,'page':nextpages},
		success: function(data) {
			console.log(data)
			// if(data.code === '1')
			// {
			// 	$('#row-list-product').html("")
			// 	var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
			// 		return b.totalSold - a.totalSold;
			// 	}) : data.listProduct.sort(function(a,b){
			// 		return new Date(b.date) - new Date(a.date);
			// 	})).map(p =>{
			// 		$('#row-list-product').append(`
			// 			<div class="col-md-4 col-xs-6">
			// 				<div class="product">
			// 					<div id="newItem" class="product-img">
			// 						<img src="${p.image.path}" alt="">
			// 						<div class="product-label">
			// 							<span class="sale">-30%</span>
			// 							<span class="new">NEW</span>
			// 						</div>
			// 					</div>
			// 					<div class="product-body">
			// 						<p class="product-category">${p.category}</p>
			// 						<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
			// 						<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
			// 						<div class="product-rating">
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 						</div>
			// 						<div class="product-btns">
			// 							<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
			// 							<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
			// 							<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
			// 						</div>
			// 						<span class="totalSold">${p.totalSold} sold</span>
			// 					</div>
			// 					<div id="store-list" class="add-to-cart">
			// 						<button class="add-to-cart-btn" data-productName="${p.name}" 
			// 						data-productPrice="${p.price}" data-productNumber="1">
			// 							<i class="fa fa-shopping-cart"></i> 
			// 							add to cart
			// 						</button>
			// 					</div>
			// 				</div>
			// 			</div>
			// 		`)
			// 	})
			// }
			// else if(data.code === '2')
			// {
			// 	$('#row-list-product').html("")
			// 	var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
			// 		return b.totalSold - a.totalSold;
			// 	}) : data.listProduct.sort(function(a,b){
			// 		return new Date(b.date) - new Date(a.date);
			// 	})).map(p =>{
			// 		$('#row-list-product').append(`
			// 			<div class="col-md-4 col-xs-6">
			// 				<div class="product">
			// 					<div id="newItem" class="product-img">
			// 						<img src="${p.image.path}" alt="">
			// 						<div class="product-label">
			// 							<span class="sale">-30%</span>
			// 							<span class="new">NEW</span>
			// 						</div>
			// 					</div>
			// 					<div class="product-body">
			// 						<p class="product-category">${p.category}</p>
			// 						<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
			// 						<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
			// 						<div class="product-rating">
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 						</div>
			// 						<div class="product-btns">
			// 							<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
			// 							<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
			// 							<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
			// 						</div>
			// 						<span class="totalSold">${p.totalSold} sold</span>
			// 					</div>
			// 					<div class="add-to-cart">
			// 						<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
			// 						data-productPrice="${p.price}" data-productNumber="1">
			// 							<i class="fa fa-shopping-cart"></i> 
			// 							add to cart
			// 						</button>
			// 					</div>
			// 				</div>
			// 			</div>
			// 		`)
			// 	})
			// }
			// else if(data.code === '3')
			// {
			// 	$('#row-list-product').html("")
			// 	var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
			// 		return b.totalSold - a.totalSold;
			// 	}) : data.listProduct.sort(function(a,b){
			// 		return new Date(b.date) - new Date(a.date);
			// 	})).map(p =>{
			// 		$('#row-list-product').append(`
			// 			<div class="col-md-4 col-xs-6">
			// 				<div class="product">
			// 					<div id="newItem" class="product-img">
			// 						<img src="${p.image.path}" alt="">
			// 						<div class="product-label">
			// 							<span class="sale">-30%</span>
			// 							<span class="new">NEW</span>
			// 						</div>
			// 					</div>
			// 					<div class="product-body">
			// 						<p class="product-category">${p.category}</p>
			// 						<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
			// 						<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
			// 						<div class="product-rating">
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 						</div>
			// 						<div class="product-btns">
			// 							<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
			// 							<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
			// 							<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
			// 						</div>
			// 						<span class="totalSold">${p.totalSold} sold</span>
			// 					</div>
			// 					<div class="add-to-cart">
			// 						<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
			// 						data-productPrice="${p.price}" data-productNumber="1">
			// 							<i class="fa fa-shopping-cart"></i> 
			// 							add to cart
			// 						</button>
			// 					</div>
			// 				</div>
			// 			</div>
			// 		`)
			// 	})
			// }
			// else if(data.code === '5')
			// {
			// 	$('#row-list-product').html("")
			// 	var arr = (data.sortBy == '1' ? data.listProduct.sort(function(a,b){
			// 		return b.totalSold - a.totalSold;
			// 	}) : data.listProduct.sort(function(a,b){
			// 		return new Date(b.date) - new Date(a.date);
			// 	})).map(p =>{
			// 		console.log(p)
			// 		$('#row-list-product').append(`
			// 			<div class="col-md-4 col-xs-6">
			// 				<div class="product">
			// 					<div id="newItem" class="product-img">
			// 						<img src="${p.image.path}" alt="">
			// 						<div class="product-label">
			// 							<span class="sale">-30%</span>
			// 							<span class="new">NEW</span>
			// 						</div>
			// 					</div>
			// 					<div class="product-body">
			// 						<p class="product-category">${p.category}</p>
			// 						<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
			// 						<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
			// 						<div class="product-rating">
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 							<i class="fa fa-star"></i>
			// 						</div>
			// 						<div class="product-btns">
			// 							<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
			// 							<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
			// 							<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
			// 						</div>
			// 						<span class="totalSold">${p.totalSold} sold</span>
			// 					</div>
			// 					<div class="add-to-cart">
			// 						<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
			// 						data-productPrice="${p.price}" data-productNumber="1">
			// 							<i class="fa fa-shopping-cart"></i> 
			// 							add to cart
			// 						</button>
			// 					</div>
			// 				</div>
			// 			</div>
			// 		`)
			// 	})
			// }
		}
	})
	return false;
}

function switchPageReview(e)
{
	var currentpages = $('ul#pagination-review > li.active')
	var nextpages = $(e)

	if(!$(e).hasClass("arrow-pagination"))
	{
		currentpages.removeClass('active')
		nextpages.addClass('active')
	}
	var currentpages = parseInt(currentpages.text().trim())
	var nextpages;
	var pageTotal = parseInt(($('ul#pagination-review > li:not(".arrow-pagination")').last()).text())
	
	if(!$(e).text() && $(e).find('i[class*="fa-angle-left"]').length)
	{
		nextpages = currentpages - 1
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-left"]').length)
	{
		nextpages = 1
		$(`ul#pagination-review > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-review > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-review').find('li.arrow-pagination').children('i[class*="-left"]').parent().remove()
		$('ul#pagination-review').append(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-right"]').length)
	{
		nextpages = currentpages + 1
		$(`ul#pagination-review > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-review > li:contains(${nextpages})`).addClass('active')
	}
	else if(!$(e).text() && $(e).find('i[class*="fa-angle-double-right"]').length)
	{
		nextpages = pageTotal
		$(`ul#pagination-review > li:contains(${currentpages})`).removeClass('active')
		$(`ul#pagination-review > li:contains(${nextpages})`).addClass('active')
		$('ul#pagination-review').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-review').prepend(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
	}
	else
	{
		nextpages = parseInt(nextpages.text().trim())
	}

	var totalPages = paginationPage(nextpages,pageTotal)

	if(nextpages == pageTotal)
	{
		$('ul#pagination-review').html("")
		$('ul#pagination-review').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-review').prepend(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-review').append(`
					<li onclick="switchPageReview(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-review').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-review').append(`
						<li class="" onclick="switchPageReview(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
	}
	if(nextpages > 0 && nextpages < pageTotal)
	{
		$('ul#pagination-review').html("")
		$('ul#pagination-review').find('li.arrow-pagination').children('i[class*="-right"]').parent().remove()
		$('ul#pagination-review').prepend(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-left"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-left"></i></li>
		`)

		for (var i = 0; i < totalPages.length; i++) {
			if (totalPages[i] === nextpages) {
			  $('ul#pagination-review').append(`
				<li onclick="switchPageReview(this)" class="active">${nextpages}</li>
			  `);
			} 
			else 
			{
			  if (typeof totalPages[i] !== 'number') {
				$('ul#pagination-review').append(`
				  <div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
				`);
			  } else {
				$('ul#pagination-review').append(`
				  <li class="" onclick="switchPageReview(this)">${totalPages[i]}</li>
				`);
			  }
			}
		}

		$('ul#pagination-review').append(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}
	if(nextpages == 1)
	{
		$('ul#pagination-review').html("")
		$('ul#pagination-review').find('li.arrow-pagination').remove()
		for(var i = 0;i < totalPages.length;i++)
		{
			if(totalPages[i] === nextpages)
			{
				$('ul#pagination-review').append(`
					<li onclick="switchPageReview(this)" class="active">${nextpages}</li>
				`)
			}
			else
			{
				if(typeof totalPages[i] !== 'number')
				{
					$('ul#pagination-review').append(`
						<div class="" style="display: inline-block;margin: 0 10px;">${totalPages[i]}</div>
					`)
				}
				else
				{
					$('ul#pagination-review').append(`
						<li class="" onclick="switchPageReview(this)">${totalPages[i]}</li>
					`)
				}
			}
		}
		$('ul#pagination-review').append(`
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
			<li onclick="switchPageReview(this)" class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
		`)
	}

	$.ajax ({
		type: "POST",
		url: `${window.location.href}/page/${nextpages}`,
		cache: false,
		data: { 'currentpages': currentpages-1, 'nextpages': nextpages-1,'totalpages': pageTotal},
		success: function(data) {
			if(data.code === '50')
			{
				$('#row-list-review').html("")
				data.listReview.map(p =>{
					$('#row-list-review').append(`
						<li>
							<div class="review-heading">
								<h5 class="name">${p.userReview}</h5>
								<p class="date">${p.date}</p>
								<div class="review-rating">
									${addNoneStar(p.rating)}
								</div>
							</div>
							<div class="review-body">
								<p>${p.reviewPost}</p>
							</div>
						</li>
					`)
				})
			}
		}
	})
	
	return false;
}

function filter_product(value)
{
	$.ajax({
		async:true,
		url: window.location.href,
		type: 'POST',
		data: value,
		success: function(data){
			console.log(data)
			if(data.listProduct.length)
			{
				$('#row-list-product').html("")
				$('.store-qty').text(`Showing ${data.perPage}-100 products`)
				var arr = (data.sortBy === 1 ? data.listProduct.sort(function(a,b){
					return b.totalSold - a.totalSold;
				}) : data.listProduct.sort(function(a,b){
					return new Date(b.date) - new Date(a.date);
				})).map(p =>{
					$('#row-list-product').append(`
						<div class="col-md-4 col-xs-6">
							<div class="product">
								<div id="newItem" class="product-img">
									<img src="${p.image.path}" alt="">
									<div class="product-label">
										<span class="sale">-30%</span>
										<span class="new">NEW</span>
									</div>
								</div>
								<div class="product-body">
									<p class="product-category">${p.category}</p>
									<h3 class="product-name"><a href="/product/${linkProduct(p.name)}">${p.name}</a></h3>
									<h4 class="product-price">$${addDos(p.price)}<del class="product-old-price">$990.00</del></h4>
									<div class="product-rating">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
									<div class="product-btns">
										<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
										<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
										<button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
									</div>
									<span class="totalSold">${p.totalSold} sold</span>
								</div>
								<div class="add-to-cart">
									<button id="store-list" class="add-to-cart-btn" data-productName="${p.name}" 
									data-productPrice="${p.price}" data-productNumber="1">
										<i class="fa fa-shopping-cart"></i> 
										add to cart
									</button>
								</div>
							</div>
						</div>
					`)
				})

				$('ul#pagination-product').html("")
				for(var i = 1;i <= data.totalPages .length;i++)
				{
					if(i === data.currentpage)
					{
						$('ul#pagination-product').append(`
							<li onclick="switchPage(this)" class="active">${data.totalPages[i-1]}</li>
						`)
					}
					else
					{
						$('ul#pagination-product').append(`
							<li onclick="switchPage(this)" >${data.totalPages[i-1]}</li>
						`)
					}
				}
				if(data.pageTotal > 1)
				{
					$('ul#pagination-product').append(`
					<li class="arrow-pagination"><i class="fa fa-angle-right"></i></li>
					`)
					$('ul#pagination-product').append(`
					<li class="arrow-pagination"><i class="fa fa-angle-double-right"></i></li>
					`)
				}
			}
		}
	});
}

function quickAddCart(e)
{
	if(e.data())
	{
		var productName = e.data('productname')
		var productPrice = e.data('productprice')
		var productNumber = e.data('productnumber')
		let alert = $("#alert-dismissible");
		$.ajax({ 
			type: "POST", 
			url: '/', 
			async: true,
			data: {"productName":productName,"productPrice":productPrice,"productNumber":productNumber,action:"add"}, 
			cache: false,
			success: function(data){
				console.log(data)
				if(data.code === '3')
				{
					productName = ''
					productPrice = ''
					productNumber = ''
					$('.alert-dismissible').addClass('alert-success')
					$('.alert-dismissible').show()
					$(window).scrollTop(alert.offset().top + $("#listType").height() - $("#hot-deal").height());
					$('.alert-dismissible').html(`
						<strong>Success</strong> Add to your cart
					`).delay(2000).fadeOut(function() {
						$('.alert-dismissible').removeClass('alert-success')
						$(this).empty(); 
					});
					var arr = data.cart.map(c =>{
						$('#cart-list-dropdown').prepend(`
						<div class="product-widget">
								<div class="product-img">
									<img src="${c.productImage.path}" alt="">
								</div>
								<div class="product-body">
									<h3 id="product-name-dropdown" class="product-name"><a href="/product/${c.productName}">${c.productName}</a></h3>
									<h4 id="product-price-dropdown" class="product-price"><span id="qty-dropdown" class="qty">${c.productNumber}x</span>${addDos(c.productPrice)}</h4>
								</div>
								<button id="delete-product-cart" class="delete" onclick="triggerClick(this)">
									<i id="delete-product-icon" class="fa fa-close"></i>
								</button>
							</div>
						`)
						$('#list-cart-dropdown').append(`
							<div class="qty" id="qty-dropdown">${c.productNumber}</div>
						`)
						$('#cart-summary-totalNumber').text(`${c.productNumber} Item(s) selected`)
						$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(c.productPrice)}`)
					})
				}
				else if(data.code === '4')
				{
					productName = ''
					productPrice = ''
					productNumber = ''
					$('.alert-dismissible').addClass('alert-success')
					$('.alert-dismissible').show()
					$(window).scrollTop(alert.offset().top + $("#listType").height() - $("#hot-deal").height());
					$('.alert-dismissible').html(`
						<strong>Success</strong> Add to your cart
					`).delay(2000).fadeOut(function() {
						$('.alert-dismissible').removeClass('alert-success')
						$(this).empty(); 
					});
					let infoProduct = $(`h3#product-name-dropdown.product-name`)
					infoProduct.each(function () {
						if($(this).text()== data.productName)
						{
							if($(this).length > 0)
							{
								$(this).next().find('span#qty-dropdown').text(`${data.productNumber}x`)
							}
							$('#qty-dropdown').text(`${data.totalNumber}`)
							$('#cart-summary-totalNumber').text(`${data.totalNumber} Item(s) selected`)
							$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(data.totalPrice)}`)
						}
					})
				}
				else if(data.code === '5')
				{
					productName = ''
					productPrice = ''
					productNumber = ''
					$('.alert-dismissible').addClass('alert-success')
					$('.alert-dismissible').show()
					$(window).scrollTop(alert.offset().top + $("#listType").height() - $("#hot-deal").height());
					$('.alert-dismissible').html(`
						<strong>Success</strong> Add to your cart
					`).delay(2000).fadeOut(function() {
						$('.alert-dismissible').removeClass('alert-success')
						$(this).empty(); 
					});
					$('#cart-list-dropdown').append(`
						<div class="product-widget">
							<div class="product-img">
								<img src="${data.newCart.productImage.path}" alt="">
							</div>
							<div class="product-body">
								<h3 id="product-name-dropdown" class="product-name"><a href="/product/${data.newCart.productName}">${data.newCart.productName}</a></h3>
								<h4 id="product-price-dropdown" class="product-price"><span id="qty-dropdown" class="qty">${data.newCart.productNumber}x</span>${addDos(data.newCart.productPrice)}</h4>
							</div>
							<button id="delete-product-cart" class="delete" onclick="triggerClick(this)">
								<i id="delete-product-icon" class="fa fa-close"></i>
							</button>
						</div>
					`)
					if($('a#list-cart-dropdown >div#qty-dropdown').length)
					{
						$('#qty-dropdown').text(`${data.totalNumber}`)
					}
					else
					{
						$('#list-cart-dropdown').append(`
							<div class="qty" id="qty-dropdown">${data.totalNumber}</div>
						`)
					}
					$('#cart-summary-totalNumber').text(`${data.totalNumber} Item(s) selected`)
					$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(data.totalPrice)}`)
				}
				else if(data.code === '2')
				{
					$('.alert-dismissible').addClass('alert-danger')
					$('.alert-dismissible').show()
					$(window).scrollTop(alert.offset().top + $("#listType").height() - $("#hot-deal").height());
					$('.alert-dismissible').html(`
						<strong>Error</strong> ${data.message} 
						<a href="/user/login">Click here</a>
					`).delay(3000).fadeOut(function() {
						$('.alert-dismissible').removeClass('alert-danger')
						$(this).empty(); 
					});
				}
				else
				{
					$('.alert-dismissible').addClass('alert-danger')
					$('.alert-dismissible').show()
					$(window).scrollTop(alert.offset().top + $("#listType").height() - $("#hot-deal").height());
					$('.alert-dismissible').html(`
						<strong>Error</strong> ${data.message}
					`).delay(3000).fadeOut(function() {
						$('.alert-dismissible').removeClass('alert-danger')
						$(this).empty(); 
					});
				}

			}
		})
	}
	return false;
}

function linkProduct(value){
	if(value)
	{
		return value.toLowerCase().replace(/ /g,'-')
	}
}

function addDos(value)
{
	value += '';
	let x = value.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2'); // changed comma to dot here
	}
	return x1 + x2;
}

function triggerClick(e)
{
	let productName = $(e).prev().find('h3#product-name-dropdown').text()
	$.ajax({ 
		type: "POST", 
		url: '/', 
		async: true,
		data: {"productName":productName,action:"delete"}, 
		cache: false,
		success: function(data){
			let childCart = $(`h3#product-name-dropdown.product-name`)
			childCart.each(function () {
				if($(this).text()== data.productName)
				{
					$(this).parent().parent().remove()
					$('#qty-dropdown').text(`${data.totalNumber}`)
					$('#cart-summary-totalNumber').text(`${data.totalNumber} Item(s) selected`)
					$('#cart-summary-totalPrice').text(`SUBTOTAL: $${addDos(data.totalPrice)}`)
					if($('.order-col').length)
					{
						$('.order-col').each(function() {
							if ($(this).attr('data-name') == productName) {
								$(this).remove()
								let productPrice = parseInt($(this).find('div#price-checkout').text())
								let totalPrice = $('.order-total')
								totalPrice.text(addDos(data.totalPrice))
							}
						});
					}
				}
			});
			if($('#cart-list-dropdown').children().length === 0)
			{
				$('div#qty-dropdown.qty').remove()
				$('#cart-summary-totalNumber').text(`0 Item(s) selected`)
				$('#cart-summary-totalPrice').text(`SUBTOTAL: $0`)
			}
		}
	})
}

function submitBill(e)
{
	if($('input:radio[name="payment"]').is(':checked'))
	{
		if($('input:radio[name="payment"]:checked').attr('id') === 'payment-2')
		{
			var creditCard = $('input:radio[name="payment"]:checked').next().next().find('input#creditCardBill.input').val()
			var cvv = $('input:radio[name="payment"]:checked').next().next().find('input#cvvBill.input').val()
			var month = $('input:radio[name="payment"]:checked').next().next().find('input#monthCreditBill.input').val()
			var year = $('input:radio[name="payment"]:checked').next().next().find('input#yearCreditBill.input').val()

			if(creditCard === '')
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your credit card
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(isNaN(creditCard))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your valid credit card
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(!creditCard.match(/^[0-9]{10}$/))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Credit number must have 10 digit
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(cvv === '')
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your cvv
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(isNaN(cvv))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your valid cvv
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(!cvv.match(/^[0-9]{3}$/))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Cvv number must have 3 digit
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(month === '')
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your cvv month
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(isNaN(month))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your valid month
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(!month.match(/^[0-9]{2}$/))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Month must have 2 digit
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(year === '')
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your cvv year
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(isNaN(creditCard))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please enter your valid year
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else if(!year.match(/^[0-9]{4}$/))
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Year must have 4 digit
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
			}
			else
			{
				// const form = document.getElementById("'#bill-form");
				// const formData = new FormData(form); 

				$('#bill-form').submit()
			}
		}
		else
		{
			var acept = $('.terms-checkout')
			if(acept.is(":checked"))
			{
				$('#bill-form').submit()
			}
			else
			{
				$('.alert-dismissible').addClass('alert-danger')
				$('.alert-dismissible').show()
				$('.alert-dismissible').html(`
					<strong>Error</strong> Please accept our terms
				`).delay(3000).fadeOut(function() {
					$('.alert-dismissible').removeClass('alert-danger')
					$(this).empty(); 
				});
				$(this).attr('href',"javascript:void(0)")
			}
		}
	}
	else
	{
		$('.alert-dismissible').addClass('alert-danger')
		$('.alert-dismissible').show()
		$('.alert-dismissible').html(`
			<strong>Error</strong> Please choose your payment method
		`).delay(3000).fadeOut(function() {
			$('.alert-dismissible').removeClass('alert-danger')
			$(this).empty(); 
		});
	}
}

function paginationPage(nextpages,pageTotal)
{
	let totalPages = []
	if (pageTotal <= 6) {
		for(var i = 1;i<=pageTotal;i++)
		{
			totalPages.push(i)
		}
	}
	else
	{
		totalPages.push(1)

		if (nextpages > 3) {
			totalPages.push("...");
		}

		if (nextpages == pageTotal) {
			totalPages.push(nextpages - 2);
		}

		if (nextpages > 2) {
			totalPages.push(nextpages - 1);
		}

		if (nextpages != 1 && nextpages != pageTotal) {
			totalPages.push(nextpages);
		}

		if (nextpages < pageTotal - 1) {
			totalPages.push(nextpages + 1);
		}
	
		if (nextpages == 1) {
			totalPages.push(nextpages + 2);
		}
	
		if (nextpages < pageTotal - 2) {
			totalPages.push("...");
		}
		totalPages.push(pageTotal)
	}

	return totalPages
}

function addNoneStar(rating)
{
	let html = ''
	for(var i=1;i <= 5;i++)
	{
		if(i <= rating)
		{
			html += '<i class="fa fa-star"></i>'
		}
		else
		{
			html += '<i class="fa fa-star-o"></i>'
		}
	}
	return html
}

function addDos(value)
{
	value += '';
	x = value.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2'); // changed comma to dot here
	}
	return x1 + x2;
}