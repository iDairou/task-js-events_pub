const init = function () {
	const imagesList = document.querySelectorAll(".gallery__item");
	imagesList.forEach((img) => {
		img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
	}); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

	runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
	const imagesSelector = ".gallery__item";
	const sliderRootSelector = ".js-slider";

	const imagesList = document.querySelectorAll(imagesSelector);
	const sliderRootElement = document.querySelector(sliderRootSelector);

	initEvents(imagesList, sliderRootElement);
	initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
	imagesList.forEach(function (item) {
		item.addEventListener("click", function (e) {
			fireCustomEvent(e.currentTarget, "js-slider-img-click");
		});
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
	// na elemencie [.js-slider__nav--next]
	const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
	navNext.addEventListener("click", function (e) {
		fireCustomEvent(e.target, "js-slider-img-next");
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
	// na elemencie [.js-slider__nav--prev]
	const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
	navPrev.addEventListener("click", function (e) {
		fireCustomEvent(e.target, "js-slider-img-prev");
	});
	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
	// tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
	const zoom = sliderRootElement.querySelector(".js-slider__zoom");
	zoom.addEventListener("click", function (e) {
		// console.log(e.target);
		e.target.classList.contains("js-slider__zoom")
			? fireCustomEvent(e.target, "js-slider-close")
			: null;
	});
};

const fireCustomEvent = function (element, name) {
	// console.log(element.className, "=>", name);

	const event = new CustomEvent(name, {
		bubbles: true,
	});

	element.dispatchEvent(event);
};

const initCustomEvents = function (
	imagesList,
	sliderRootElement,
	imagesSelector
) {
	imagesList.forEach(function (img) {
		img.addEventListener("js-slider-img-click", function (event) {
			onImageClick(event, sliderRootElement, imagesSelector);
		});
	});

	sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
	sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
	sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
	console.log(event);
	console.log(sliderRootElement);
	console.log(imagesSelector);
	// todo:
	// 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
	sliderRootElement.classList.add("js-slider--active");
	// 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
	const src = event.target.firstElementChild.getAttribute("src");
	const sliderImage = document.querySelector(".js-slider__image");
	sliderImage.setAttribute("src", src);
	// 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
	const groupName = event.target.dataset.sliderGroupName;

	// 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
	const imagesArr = [...document.querySelectorAll(imagesSelector)];

	const filteredImages = imagesArr.filter(function (el) {
		return el.dataset.sliderGroupName === groupName;
	});

	// 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
	const sliderPrototype = document.querySelector(
		".js-slider__thumbs-item--prototype"
	);
	filteredImages.forEach((e) => {
		const thumbItem = e.cloneNode(true);
		thumbItem.className = "js-slider__thumbs-item";
		thumbItem.removeChild(thumbItem.lastElementChild);
		thumbItem.firstElementChild.classList.remove("gallery__image");
		thumbItem.firstElementChild.classList.add("js-slider__thumbs-image");
		sliderPrototype.parentNode.insertBefore(thumbItem, sliderPrototype);
	});
	// 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
	const mainImage = document.querySelector(".js-slider__image");
	const thumbImages = document.querySelectorAll(".js-slider__thumbs-image");
	thumbImages.forEach((e) => {
		if (mainImage.src === e.src) {
			e.classList.add("js-slider__thumbs-image--current");
		}
	});
	runSliderInterval();
	// event.target.classList.add("js-slider__thumbs-image--current");
};

const onImageNext = function (event) {
	console.log(this, "onImageNext");
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const currentImage = document.querySelector(
		".js-slider__thumbs-image--current"
	);
	// 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	const nextImage = currentImage.parentNode.nextElementSibling;
	// 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
	if (!nextImage) {
		nextImage.firstElementChild.setAttribute(
			"src",
			firstThumbSrc.firstElementChild.getAttribute("src")
		);
	}
	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	currentImage.classList.remove("js-slider__thumbs-image--current");
	nextImage.firstElementChild.classList.add("js-slider__thumbs-image--current");
	// 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
	const sliderImage = document.querySelector(".js-slider__image");
	const newImageSrc = nextImage.firstElementChild.getAttribute("src");
	sliderImage.setAttribute("src", newImageSrc);
	/// Zadanie dodatkowe 1
	const thumbsSection = document.querySelector(".js-slider__thumbs");
	const firstThumbSrc =
		thumbsSection.firstElementChild.firstElementChild.getAttribute("src");

	if (nextImage.classList.contains("js-slider__thumbs-item--prototype")) {
		sliderImage.setAttribute("src", firstThumbSrc);
		thumbsSection.firstElementChild.firstElementChild.classList.add(
			"js-slider__thumbs-image--current"
		);
	}
};

const onImagePrev = function (event) {
	// console.log(this, "onImagePrev");
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const currentImage = document.querySelector(
		".js-slider__thumbs-image--current"
	);
	// 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	const prevImage = currentImage.parentNode.previousElementSibling;
	const thumbsSection = document.querySelector(".js-slider__thumbs");

	// 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	// 5. podmienić atrybut [src] dla [.js-slider__image]
	const sliderImage = document.querySelector(".js-slider__image");
	if (
		prevImage &&
		!prevImage.classList.contains("js-slider__thumbs-item--prototype")
	) {
		currentImage.classList.remove("js-slider__thumbs-image--current");
		prevImage.firstElementChild.classList.add(
			"js-slider__thumbs-image--current"
		);
		const newImageSrc = prevImage.firstElementChild.getAttribute("src");
		sliderImage.setAttribute("src", newImageSrc);
	} else {
		currentImage.classList.remove("js-slider__thumbs-image--current");
		sliderImage.setAttribute(
			"src",
			thumbsSection.lastElementChild.previousElementSibling.firstElementChild.getAttribute(
				"src"
			)
		);
		thumbsSection.lastElementChild.previousElementSibling.firstElementChild.classList.add(
			"js-slider__thumbs-image--current"
		);
	}

};

const onClose = function (event) {
	// todo:
	// 1. należy usunać klasę [js-slider--active] dla [.js-slider]
	const slider = document.querySelector(".js-slider");
	slider.classList.remove("js-slider--active");
	// 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
	const thumbSection = document.querySelector(".js-slider__thumbs");

	Array.from(thumbSection.children).forEach((e) => {
		if (!e.classList.contains("js-slider__thumbs-item--prototype")) {
			thumbSection.removeChild(e);
		}
	});
	stopSliderInterval();
};

let interval;
const runSliderInterval = function () {
	interval = setInterval(onImageNext, 3000);
};
const stopSliderInterval = function () {
	clearInterval(interval);
};
