const search = document.getElementById('search'),
 submit = document.getElementById('submit'),
 random = document.getElementById('random'),
 mealsEl = document.getElementById('meals'),
 resultHeading = document.getElementById('result-heading'),
 single_mealEl = document.getElementById('single-meal');



// Search Meal and Fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear Single Meal
    single_mealEl.innerHTML = '';

    // Get the search Term 
    const term = search.value;

    // Check for empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.meals);
            resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`;

            if(data.meals == null) {
                resultHeading.innerHTML = `<p>There are no search results, please try again!</p>`
            } else {
                mealsEl.innerHTML = data.meals.map(meal =>  `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>Title: ${meal.strMeal}</h3>
                        </div>
                    </div>
                `).join(''); 
            }

            // Clear Search Text
            search.value = '';
        }); 
    } else {
        alert('Please Enter a search value');
    }

}

// Fetch Meal By MealId
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        // Add Meal Info To the Dom]
        addMealInfoToDom(meal);
    });
}

// Add Meal Info To The Dom
function addMealInfoToDom(meal) {

    const ingredients = [];
    for(let i = 1; i<= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    console.log(ingredients);
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>Title: ${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}"  alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory }</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients:</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Fetch Random meal
function getRandomMeal() {
    // Clear Meals
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => addMealInfoToDom(data.meals[0]));
}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false;
        }
    });

    console.log();
    if(mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealID');
        getMealById(mealId);
    }

});