import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';

// Types for nutrition data
interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  nutrients: NutrientInfo;
  image?: string;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  date: string;
  foods: FoodItem[];
}

// Mock food data
const mockFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    servingSize: '100g',
    nutrients: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    },
    image: 'https://picsum.photos/id/190/200/200'
  },
  {
    id: '2',
    name: 'Brown Rice',
    servingSize: '100g cooked',
    nutrients: {
      calories: 112,
      protein: 2.6,
      carbs: 23,
      fat: 0.9
    },
    image: 'https://picsum.photos/id/191/200/200'
  },
  {
    id: '3',
    name: 'Avocado',
    servingSize: '1 medium',
    nutrients: {
      calories: 240,
      protein: 3,
      carbs: 12,
      fat: 22
    },
    image: 'https://picsum.photos/id/192/200/200'
  },
  {
    id: '4',
    name: 'Salmon Fillet',
    servingSize: '100g',
    nutrients: {
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13
    },
    image: 'https://picsum.photos/id/193/200/200'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    servingSize: '170g container',
    nutrients: {
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4
    },
    image: 'https://picsum.photos/id/194/200/200'
  },
  {
    id: '6',
    name: 'Spinach',
    servingSize: '100g',
    nutrients: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4
    },
    image: 'https://picsum.photos/id/195/200/200'
  }
];

// Mock meal data for today
const mockTodayMeals: Meal[] = [
  {
    id: '1',
    name: 'Breakfast',
    time: '7:30 AM',
    date: '2025-04-14',
    foods: [
      mockFoodDatabase[4], // Greek Yogurt
      {
        id: '7',
        name: 'Blueberries',
        servingSize: '1 cup',
        nutrients: {
          calories: 84,
          protein: 1.1,
          carbs: 21,
          fat: 0.5
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Lunch',
    time: '12:15 PM',
    date: '2025-04-14',
    foods: [
      mockFoodDatabase[0], // Grilled Chicken
      mockFoodDatabase[1], // Brown Rice
      mockFoodDatabase[5]  // Spinach
    ]
  }
];

// Daily nutrition goal
const dailyNutritionGoal: NutrientInfo = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65
};

export default function NutritionScreen() {
  const [meals, setMeals] = useState<Meal[]>(mockTodayMeals);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [addFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [scanBarcodeModalVisible, setScanBarcodeModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  // Calculate total nutrients consumed today
  const calculateTotalNutrients = (): NutrientInfo => {
    const initialNutrients = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return meals.reduce((mealTotal, meal) => {
      const mealNutrients = meal.foods.reduce((foodTotal, food) => {
        return {
          calories: foodTotal.calories + food.nutrients.calories,
          protein: foodTotal.protein + food.nutrients.protein,
          carbs: foodTotal.carbs + food.nutrients.carbs,
          fat: foodTotal.fat + food.nutrients.fat
        };
      }, initialNutrients);
      
      return {
        calories: mealTotal.calories + mealNutrients.calories,
        protein: mealTotal.protein + mealNutrients.protein,
        carbs: mealTotal.carbs + mealNutrients.carbs,
        fat: mealTotal.fat + mealNutrients.fat
      };
    }, initialNutrients);
  };

  const totalNutrients = calculateTotalNutrients();

  // Calculate percentage of daily goal
  const calculatePercentage = (value: number, goal: number): number => {
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  // Filter foods based on search query
  const filteredFoods = mockFoodDatabase.filter(food =>
    food.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  // Add food to selected meal
  const addFoodToMeal = (foodItem: FoodItem) => {
    if (selectedMealId) {
      const updatedMeals = meals.map(meal => {
        if (meal.id === selectedMealId) {
          return {
            ...meal,
            foods: [...meal.foods, foodItem]
          };
        }
        return meal;
      });
      
      setMeals(updatedMeals);
      setAddFoodModalVisible(false);
      setFoodSearchQuery('');
    }
  };

  // Add a new meal
  const addNewMeal = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'New Meal',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      foods: []
    };
    
    setMeals([...meals, newMeal]);
  };

  // Render meal item with foods
  const renderMealItem = ({ item }: { item: Meal }) => {
    // Calculate meal nutrients
    const mealNutrients = item.foods.reduce(
      (total, food) => {
        return {
          calories: total.calories + food.nutrients.calories,
          protein: total.protein + food.nutrients.protein,
          carbs: total.carbs + food.nutrients.carbs,
          fat: total.fat + food.nutrients.fat
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealTime}>{item.time}</Text>
          </View>
          <Text style={styles.mealCalories}>{mealNutrients.calories} cal</Text>
        </View>
        
        {item.foods.length > 0 ? (
          <View style={styles.foodsList}>
            {item.foods.map((food) => (
              <View key={`${item.id}-${food.id}`} style={styles.foodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.servingSize}</Text>
                </View>
                <Text style={styles.foodCalories}>{food.nutrients.calories} cal</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyMealText}>No foods added yet</Text>
        )}
        
        <TouchableOpacity 
          style={styles.addFoodButton}
          onPress={() => {
            setSelectedMealId(item.id);
            setAddFoodModalVisible(true);
          }}
        >
          <FontAwesome name="plus" size={14} color="#FF4B4B" />
          <Text style={styles.addFoodText}>Add Food</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render food search result
  const renderFoodSearchItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => addFoodToMeal(item)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.foodImage} />
      )}
      <View style={styles.foodSearchInfo}>
        <Text style={styles.foodSearchName}>{item.name}</Text>
        <Text style={styles.foodSearchDetails}>
          {item.servingSize} • {item.nutrients.calories} cal
        </Text>
      </View>
      <View style={styles.macroInfo}>
        <Text style={styles.macroText}>P: {item.nutrients.protein}g</Text>
        <Text style={styles.macroText}>C: {item.nutrients.carbs}g</Text>
        <Text style={styles.macroText}>F: {item.nutrients.fat}g</Text>
      </View>
    </TouchableOpacity>
  );

  // Add food modal
  const renderAddFoodModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addFoodModalVisible}
      onRequestClose={() => setAddFoodModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Food</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setAddFoodModalVisible(false)}
            >
              <FontAwesome name="times" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              value={foodSearchQuery}
              onChangeText={setFoodSearchQuery}
              autoFocus
            />
          </View>
          
          <TouchableOpacity 
            style={styles.scanBarcodeButton}
            onPress={() => {
              setAddFoodModalVisible(false);
              setScanBarcodeModalVisible(true);
            }}
          >
            <FontAwesome name="barcode" size={16} color="#FF4B4B" />
            <Text style={styles.scanBarcodeText}>Scan Barcode</Text>
          </TouchableOpacity>
          
          <FlatList
            data={filteredFoods}
            renderItem={renderFoodSearchItem}
            keyExtractor={item => item.id}
            style={styles.searchResults}
            ListEmptyComponent={
              foodSearchQuery.length > 0 ? (
                <Text style={styles.noResultsText}>No foods found</Text>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );

  // Barcode scanner modal (simulated)
  const renderBarcodeScannerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={scanBarcodeModalVisible}
      onRequestClose={() => setScanBarcodeModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setScanBarcodeModalVisible(false)}
          >
            <FontAwesome name="times" size={24} color="#666666" />
          </TouchableOpacity>
          
          <View style={styles.scannerContainer}>
            <FontAwesome name="camera" size={48} color="#CCCCCC" />
            <Text style={styles.scannerText}>Scan a food barcode</Text>
            <Text style={styles.scannerSubtext}>
              Position the barcode in the center of the screen
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.simulateScanButton}
            onPress={() => {
              // Simulate finding a random food item
              const randomIndex = Math.floor(Math.random() * mockFoodDatabase.length);
              const randomFood = mockFoodDatabase[randomIndex];
              
              setScanBarcodeModalVisible(false);
              
              if (selectedMealId) {
                addFoodToMeal(randomFood);
                setAddFoodModalVisible(false);
              }
            }}
          >
            <Text style={styles.simulateScanText}>Simulate Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Tracker</Text>
          <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Summary</Text>
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Calories</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${calculatePercentage(totalNutrients.calories, dailyNutritionGoal.calories)}%` }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>
              {totalNutrients.calories} / {dailyNutritionGoal.calories}
            </Text>
          </View>
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Protein</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  styles.proteinBar,
                  { width: `${calculatePercentage(totalNutrients.protein, dailyNutritionGoal.protein)}%` }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>
              {totalNutrients.protein}g / {dailyNutritionGoal.protein}g
            </Text>
          </View>
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Carbs</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  styles.carbsBar,
                  { width: `${calculatePercentage(totalNutrients.carbs, dailyNutritionGoal.carbs)}%` }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>
              {totalNutrients.carbs}g / {dailyNutritionGoal.carbs}g
            </Text>
          </View>
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Fat</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  styles.fatBar,
                  { width: `${calculatePercentage(totalNutrients.fat, dailyNutritionGoal.fat)}%` }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>
              {totalNutrients.fat}g / {dailyNutritionGoal.fat}g
            </Text>
          </View>
        </View>
        
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity 
              style={styles.addMealButton}
              onPress={addNewMeal}
            >
              <FontAwesome name="plus" size={14} color="white" />
              <Text style={styles.addMealText}>Add Meal</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={meals}
            renderItem={renderMealItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      
      {renderAddFoodModal()}
      {renderBarcodeScannerModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#666666',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientLabel: {
    width: 70,
    fontSize: 16,
    color: '#333333',
  },
  nutrientValue: {
    width: 90,
    fontSize: 16,
    color: '#666666',
    textAlign: 'right',
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF4B4B',
  },
  proteinBar: {
    backgroundColor: '#2196F3',
  },
  carbsBar: {
    backgroundColor: '#FFC107',
  },
  fatBar: {
    backgroundColor: '#FF9800',
  },
  mealsSection: {
    margin: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addMealText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  mealTime: {
    fontSize: 14,
    color: '#666666',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4B4B',
  },
  foodsList: {
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    color: '#333333',
  },
  foodServing: {
    fontSize: 14,
    color: '#666666',
  },
  foodCalories: {
    fontSize: 16,
    color: '#666666',
  },
  emptyMealText: {
    fontStyle: 'italic',
    color: '#999999',
    marginBottom: 10,
  },
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  addFoodText: {
    color: '#FF4B4B',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    margin: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
    color: '#666666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  scanBarcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF4B4B',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  scanBarcodeText: {
    color: '#FF4B4B',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  foodSearchInfo: {
    flex: 1,
  },
  foodSearchName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  foodSearchDetails: {
    fontSize: 14,
    color: '#666666',
  },
  macroInfo: {
    alignItems: 'flex-end',
  },
  macroText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  noResultsText: {
    padding: 20,
    textAlign: 'center',
    color: '#999999',
    fontStyle: 'italic',
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    height: 300,
  },
  scannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  scannerSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  simulateScanButton: {
    backgroundColor: '#FF4B4B',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  simulateScanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});