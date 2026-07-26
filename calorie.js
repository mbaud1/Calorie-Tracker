
  // --- State Management ---
  let dailyGoal = 2000;
  let foodItems = []; // Array to store current day's food objects: { id, name, calories }

  // DOM Elements
  const dailyGoalInput = document.getElementById('daily-goal');
  const totalCaloriesEl = document.getElementById('total-calories');
  const remainingCaloriesEl = document.getElementById('remaining-calories');
  const foodNameInput = document.getElementById('food-name');
  const foodCaloriesInput = document.getElementById('food-calories');
  const foodList = document.getElementById('food-list');

  // Load saved data when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    const savedGoal = localStorage.getItem('calorieGoal');
    const savedItems = localStorage.getItem('foodItems');

    if (savedGoal) {
      dailyGoal = parseInt(savedGoal, 10);
      dailyGoalInput.value = dailyGoal;
    }

    if (savedItems) {
      foodItems = JSON.parse(savedItems);
    }

    updateUI();
  });

  // --- Core Functions ---

  // 1. Save Calorie Goal
  function saveGoal() {
    const newGoal = parseInt(dailyGoalInput.value, 10);
    if (isNaN(newGoal) || newGoal <= 0) {
      alert('Please enter a valid calorie goal.');
      return;
    }
    dailyGoal = newGoal;
    localStorage.setItem('calorieGoal', dailyGoal);
    updateUI();
  }

  // 2. Add Food Item
  function addFood() {
    const name = foodNameInput.value.trim();
    const calories = parseInt(foodCaloriesInput.value, 10);

    if (!name || isNaN(calories) || calories <= 0) {
      alert('Please enter a valid food name and calorie amount.');
      return;
    }

    const newItem = {
      id: Date.now(), // unique ID for deletion
      name: name,
      calories: calories
    };

    foodItems.push(newItem);
    saveAndRefresh();

    // Clear inputs
    foodNameInput.value = '';
    foodCaloriesInput.value = '';
  }

  // 3. Delete Individual Food Item
  function deleteFood(id) {
    foodItems = foodItems.filter(item => item.id !== id);
    saveAndRefresh();
  }

  // 4. Clear Today's Log
  function clearToday() {
    if (confirm("Are you sure you want to clear today's log?")) {
      foodItems = [];
      saveAndRefresh();
    }
  }

  // Helper to save to LocalStorage & rebuild UI
  function saveAndRefresh() {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
    updateUI();
  }

  // --- UI Render & Calculation Logic ---
  function updateUI() {
    // Calculate total intake
    const totalIntake = foodItems.reduce((sum, item) => sum + item.calories, 0);
    const remaining = dailyGoal - totalIntake;

    // Update Totals
    totalCaloriesEl.textContent = totalIntake;
    remainingCaloriesEl.textContent = remaining;

    // Render Food List
    foodList.innerHTML = '';
    if (foodItems.length === 0) {
      foodList.innerHTML = '<li style="color: #777;">No meals logged today yet.</li>';
      return;
    }

    foodItems.forEach(item => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.marginBottom = '8px';

      li.innerHTML = `
        <span><strong>${item.name}</strong> - ${item.calories} kcal</span>
        <button onclick="deleteFood(${item.id})" style="background: #ff4d4d; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
      `;
      foodList.appendChild(li);
    });
  }