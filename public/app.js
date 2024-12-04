const loadSpinner = () => {
	const spinner = document.getElementById("spinner");
	if (spinner) {
		spinner.classList.remove("hidden");
	}
};

const stopSpinner = () => {
	const spinner = document.getElementById("spinner");
	if (spinner) {
		spinner.classList.add("hidden");
	}
};

const loadPetsCategories = async () => {
	const url = "https://openapi.programming-hero.com/api/peddy/categories";

	loadSpinner();

	try {
		const res = await fetch(url);
		const data = await res.json();

		displayPetCategory(data.categories);
	} catch (e) {
		console.log("Error loading categories:", e);
	} finally {
		stopSpinner();
	}
};

const displayPetCategory = (petCategories) => {
	const petCategoryContainer = document.getElementById("petCategory");

	petCategories.forEach((pet) => {
		const buttonContainer = document.createElement("div");
		console.log("Category pet:", pet.category);

		buttonContainer.innerHTML = `
            <div id="btn-${pet.category}" class="flex text-center category-btn space-x-4 cursor-pointer p-2 border rounded-lg hover:bg-gray-200">
                <div>
                    <img src="${pet.category_icon}" class="w-16 h-16 object-cover" alt="${pet.category}" />
                </div>
                <div>
                    <h2 class="text-center text-2xl font-bold py-4">${pet.category}</h2>
                </div>
            </div>
        `;

		buttonContainer
			.querySelector(`#btn-${pet.category}`)
			.addEventListener("click", () => {
				loadPetsByCategory(pet.category);
			});

		petCategoryContainer.append(buttonContainer);
	});
};

const loadingAllPets = async () => {
	loadSpinner();

	try {
		const url = `https://openapi.programming-hero.com/api/peddy/pets`;
		const res = await fetch(url);
		const data = await res.json();

		console.log(data);

		displayAllPets(data.pets);
	} catch (e) {
		alert("Error loading pets:", e);
	} finally {
		stopSpinner();
	}
};

const displayAllPets = (pets) => {
	const allPetsContainer = document.getElementById("allPets");
	allPetsContainer.innerHTML = "";

	if (!pets || pets.length === 0) {
		allPetsContainer.classList.remove("grid");
		allPetsContainer.innerHTML = ` 
            <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
                <img class="" src="./images/error.webp" alt="No pets found" /> 
                <p>No pets found</p> 
            </div>`;
	} else {
		allPetsContainer.classList.add("grid");

		pets.forEach((pet) => {
			const card = document.createElement("div");
			const petImage = pet.image ?? "./images/error.webp";
			const petName = pet.pet_name ?? "Unknown Name";
			const petBreed = pet.breed ?? "Unknown Breed";
			const petGender = pet.gender ?? "Gender not found";
			const petDetails = pet.pet_details ?? "No Detail Found";
			const petBirth = pet.date_of_birth
				? new Date(pet.date_of_birth).getFullYear()
				: "Unknown date of birth";
			const petPrice = pet.price ?? "Soon Available";

			card.innerHTML = `
                <div class="card bg-base-100 w-96 border border-gray-300 shadow-lg p-5 rounded-lg">
                    
                    <figure>
                        <img src="${petImage}" alt="${petName}" class="w-5/6 h-48 object-cover rounded-t-lg" />
                    </figure>
                    
                    <div class="card-body space-y-4">
                        <h2 class="card-title text-xl font-bold">${petName}</h2>
                        <div class="text-sm space-y-2">
                            <p class="flex items-center">
                                <img src="https://cdn-icons-png.flaticon.com/128/2839/2839585.png" alt="Breed Icon" class="w-4 h-4 mr-2" />
                                <span class="font-semibold mr-1">Breed:</span> ${petBreed}
                            </p>
                            <p class="flex items-center">
                                <img src="https://cdn-icons-png.flaticon.com/128/3217/3217869.png" alt="Birth Icon" class="w-4 h-4 mr-2" />
                                <span class="font-semibold mr-1">Birth Year:</span> ${petBirth}
                            </p>
                            <p class="flex items-center">
                                <img src="https://cdn-icons-png.flaticon.com/128/11314/11314723.png" alt="Gender Icon" class="w-4 h-4 mr-2" />
                                <span class="font-semibold mr-1">Gender:</span> ${petGender}
                            </p>
                            <p class="flex items-center">
                                <img class="w-4 h-4 mr-2" src="https://cdn-icons-png.flaticon.com/128/17863/17863065.png" alt="Price Icon" />
                                <span class="font-semibold mr-1">Price:</span> ${petPrice}
                            </p>
							<p class="hidden" >Pet details${petDetails}</p>
                        </div>
                        
                        <div class="card-actions justify-between">
                            <button onclick="likePet('${petImage}',(this))" class="btn btn-outline btn-success likeButtons cursor-pointer">
                                <img class="w-4 h-4 mr-2" src="https://cdn-icons-png.flaticon.com/128/1067/1067447.png" alt="Like Icon" />
                                Like
                            </button>
                            <button class="btn btn-outline btn-primary adoptButton">Adopt</button>
                            <button class="btn btn-outline btn-secondary detailsButton">Details</button>
                        </div>
                    </div>
                </div>
            `;
			allPetsContainer.append(card);
		});
	}
};

const removeActiveClass = () => {
	const buttons = document.getElementsByClassName("category-btn");
	for (let btn of buttons) {
		btn.classList.remove("active");
	}
};
const sortPetsByPrice = (pets) => {
	return pets.sort((a, b) => {
		const priceA = a.price != null ? a.price : 0;
		const priceB = b.price != null ? b.price : 0;
		return priceB - priceA;
	});
};
const loadPetsByCategory = async (category) => {
	loadSpinner();

	try {
		const url = `https://openapi.programming-hero.com/api/peddy/category/${category}`;
		const res = await fetch(url);
		const data = await res.json();

		console.log(data);

		if (data.status) {
			let pets = data.data;

			pets = sortPetsByPrice(pets);

			removeActiveClass();

			const activeBtn = document.getElementById(`btn-${category}`);
			if (activeBtn) {
				activeBtn.classList.add("active");
			}
			const sortedPrice = document.getElementById("sortByPrice");
			if (sortedPrice) {
				sortedPrice.innerText = "Sorted By Price";
			}

			displayAllPets(pets);
		}
	} catch (e) {
		console.error("Error loading category:", e);

		alert("Error loading category. Please try again later.");
	} finally {
		stopSpinner();
	}
};

const loadPetsByPrice = async () => {
	loadSpinner();
	try {
		const url = `https://openapi.programming-hero.com/api/peddy/pets`;
		const res = await fetch(url);
		const data = await res.json();

		console.log(data);

		if (data.status) {
			let pets = data.pets;

			const activeCategoryParent = document.querySelector("#categoryButtons");
			const activeCategoryChild = activeCategoryParent
				? activeCategoryParent.querySelector(".active")
				: null;

			if (activeCategoryChild) {
				const activeCategory = activeCategoryChild.id.replace("btn-", "");

				pets = pets.filter((pet) => pet.category === activeCategory);
			}

			const sortedPets = sortPetsByPrice(pets);

			const activeBtn = document.getElementById("sortByPrice");
			if (activeBtn) {
				activeBtn.innerText = "Sorted By Price";
			}

			displayAllPets(sortedPets);
		}
	} catch (e) {
		console.error("Error loading pets:", e);

		alert("Error loading pets. Please try again later.");
	} finally {
		stopSpinner();
	}
};

const setupAdoptButton = () => {
	const allPetsContainer = document.getElementById("allPets");

	allPetsContainer.addEventListener("click", (e) => {
		const adoptButton = e.target.closest(".adoptButton");
		if (adoptButton) {
			adoptPet(adoptButton);
		}
	});
};

const setupDetailsButton = () => {
	const allPetsContainer = document.getElementById("allPets");

	allPetsContainer.addEventListener("click", (e) => {
		const detailsButton = e.target.closest(".detailsButton");
		if (detailsButton) {
			const card = detailsButton.closest(".card");

			const petName =
				card.querySelector(".card-title")?.textContent || "Unknown Name";
			const petBreed =
				card.querySelectorAll("p")[0]?.textContent.replace("Breed: ", "") ||
				"Unknown Breed";
			const petBirth =
				card
					.querySelectorAll("p")[1]
					?.textContent.replace("Birth Year: ", "") || "Unknown Year";
			const petGender =
				card.querySelectorAll("p")[2]?.textContent.replace("Gender: ", "") ||
				"Unknown Gender";
			const petPrice =
				card.querySelectorAll("p")[3]?.textContent.replace("Price: ", "") ||
				"Unknown Price";
			const petImage = card.querySelector("img")?.src || "./images/error.webp";
			const petDetail =
				card.querySelectorAll("p")[4]?.textContent.replace("Details: ", "") ||
				"Details not available";

			const petDetails = {
				petName,
				petBreed,
				petImage,
				petPrice,
				petBirth,
				petGender,
				petDetail,
			};

			showDetailsModal(petDetails);
		}
	});
};

const adoptPet = (button) => {
	showAdoptionModal(() => {
		button.textContent = "Adopted";
		button.disabled = true;
		button.classList.add("btn-disabled", "bg-green-500", "text-white");
	});
};

const showAdoptionModal = (onAdoptionComplete) => {
	const modalContainer = document.createElement("div");
	modalContainer.id = "adoption-modal";
	modalContainer.className =
		"fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50";

	modalContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 text-center relative">
            <h2 class="text-2xl font-bold mb-4">Congrats! 🎉</h2>
            <p class="mb-4">Your adoption is happening</p>
            <p id="countdown" class="text-xl font-semibold mb-4">3</p>
            <button id="close-modal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                ✖
            </button>
        </div>
    `;

	document.body.appendChild(modalContainer);

	let countdownValue = 3;
	const countdownElement = modalContainer.querySelector("#countdown");
	const countdownInterval = setInterval(() => {
		countdownValue -= 1;
		if (countdownValue <= 0) {
			clearInterval(countdownInterval);
			modalContainer.remove();
			if (onAdoptionComplete) onAdoptionComplete();
		} else {
			countdownElement.textContent = countdownValue;
		}
	}, 1000);

	const closeModalButton = modalContainer.querySelector("#close-modal");
	closeModalButton.addEventListener("click", () => {
		clearInterval(countdownInterval);
		modalContainer.remove();
	});
};

const showDetailsModal = (petDetails) => {
	const modalContainer = document.createElement("div");
	modalContainer.id = "details-modal";
	modalContainer.className =
		"fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50";

	modalContainer.innerHTML = `
       
          
			<div class="card bg-base-100 p-[20px] w-[450px] border border-gray-300 shadow-lg rounded-lg relative ">
    
    <figure>
        <img src="${petDetails.petImage}" alt="${petDetails.petName}" class="w-full h-64 object-cover rounded-t-lg" />
    </figure>

   
    <div class="card-body space-y-4 p-5">
        
        <div class="flex flex-col space-y-2">
            <h2 class="card-title text-xl font-bold text-left">${petDetails.petName}</h2>

            <div class="flex space-x-4 text-sm text-left">
               
                <p class="flex items-center">
                    <img src="https://cdn-icons-png.flaticon.com/128/2839/2839585.png" alt="Breed Icon" class="w-4 h-4 mr-2" />
                    <span class="font-semibold mr-1">Breed: </span> ${petDetails.petBreed}
                </p>
                
                
                <p class="flex items-center">
                    <img src="https://cdn-icons-png.flaticon.com/128/17863/17863065.png" alt="Price Icon" class="w-4 h-4 mr-2" />
                    <span class="font-semibold mr-1">Price: </span> ${petDetails.petPrice}
                </p>
            </div>

            <div class="flex space-x-4 text-sm text-left">
                <!-- Vaccination Status -->
                <p class="flex items-center">
                    <img src="https://cdn-icons-png.flaticon.com/128/11314/11314723.png" alt="Vaccination Icon" class="w-4 h-4 mr-2" />
                    <span class="font-semibold mr-1">Vaccinated Status: </span> ${petDetails.petVaccination}
                </p>

                
                <p class="flex items-center">
                    <img src="https://cdn-icons-png.flaticon.com/128/3217/3217869.png" alt="Birth Year Icon" class="w-4 h-4 mr-2" />
                    <span class="font-semibold mr-1">Birth Year: </span> ${petDetails.petBirth}
                </p>
            </div>

            <div class="flex space-x-4 text-sm text-left">
               
                <p class="flex items-center">
                    <img class="w-4 h-4 mr-2" src="https://cdn-icons-png.flaticon.com/128/17863/17863065.png" alt="Gender Icon" />
                    <span class="font-semibold mr-1">Gender: </span> ${petDetails.petGender}
                </p>
            </div>
        </div>

      
        <div class="mt-4">
            <h3 class="font-semibold text-lg">Pet Details</h3>
            <p class="text-sm">${petDetails.petDetail}</p>
        </div>
    </div>

   
    <div class="card-actions justify-center mt-4">
        <button id="close-details-modal" class="btn btn-outline w-full btn-error">Cancel</button>
    </div>
</div>

           
        
    `;
	document.body.appendChild(modalContainer);

	const closeDetailsModalButton = modalContainer.querySelector(
		"#close-details-modal"
	);
	closeDetailsModalButton.addEventListener("click", () => {
		modalContainer.remove();
	});
};
const likePet = (petImage, buttonElement) => {
	const selectedItemsContainer = document.getElementById("selected-items");

	const existingImage = Array.from(selectedItemsContainer.children).find(
		(img) => img.src === petImage
	);

	if (existingImage) {
		selectedItemsContainer.removeChild(existingImage);

		buttonElement.classList.remove("button");
	} else {
		const petImageElement = document.createElement("img");
		petImageElement.src = petImage;
		petImageElement.classList.add(
			"w-full",
			"h-32",
			"object-cover",
			"rounded-lg"
		);
		selectedItemsContainer.appendChild(petImageElement);

		buttonElement.classList.add("button");
	}
};
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
	mobileMenu.classList.toggle("hidden");
});
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent = currentYear;

const initializeApp = () => {
	loadPetsCategories();

	loadingAllPets();

	setupAdoptButton();
	setupDetailsButton();
};

document.addEventListener("DOMContentLoaded", initializeApp);
