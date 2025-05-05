import { NextResponse } from 'next/server';

// API Keys
const AZURE_VISION_KEY = 'GEnxR09VxvFBATQ1i7fOXX6XiJxp7kJhZqZEYNi4fnKR8wQzOQdeJQQJ99BEAC5RqLJXJ3w3AAAFACOG8HGt'; // Trebat ćete dodati svoj Azure Vision ključ
const AZURE_VISION_ENDPOINT = 'https://antiquebodyapp.cognitiveservices.azure.com/'; // Trebat ćete dodati svoj Azure Vision endpoint
const USDA_API_KEY = 'FB0PddhzFxWrUI2mgAf4CGt7oHqIt3UHLyeVFl2k';
const NUTRITIONIX_APP_ID = '4224c603';
const NUTRITIONIX_API_KEY = '484c7cf7419e0479b73fa8349367e0f1';

// Common non-food items to filter out
const commonNonFoodItems = [
    'car', 'truck', 'vehicle', 'building', 'house', 'furniture', 'electronics',
    'phone', 'computer', 'laptop', 'tablet', 'camera', 'television', 'tv',
    'chair', 'table', 'desk', 'bed', 'sofa', 'couch', 'lamp', 'light',
    'clothing', 'shirt', 'pants', 'dress', 'shoes', 'hat', 'jacket',
    'animal', 'pet', 'dog', 'cat', 'bird', 'fish', 'plant', 'tree', 'flower'
];

// Food-related keywords to help with recognition
const foodKeywords = [
    // General food terms
    'food', 'meal', 'dish', 'cuisine', 'cooking', 'cooked', 'raw', 'fresh',
    'plate', 'bowl', 'serving', 'portion', 'restaurant', 'takeout', 'homemade',
    'fast food', 'junk food', 'street food', 'finger food',

    // Fast Food Chains
    'kfc', 'mcdonalds', 'burger king', 'subway', 'pizza hut', 'dominos',
    'wendys', 'taco bell', 'popeyes', 'chick fil a', 'five guys', 'shake shack',
    'in n out', 'white castle', 'chipotle', 'panera', 'arbys', 'dunkin',
    'starbucks', 'costa', 'pret a manger',

    // Balkan Cuisine
    'cevapi', 'cevapcici', 'pljeskavica', 'burek', 'sarma', 'musaka',
    'gibanica', 'ajvar', 'kajmak', 'proja', 'rakija', 'slivovitz',
    'balkan', 'bosnian', 'serbian', 'croatian', 'montenegrin',
    'slovenian', 'macedonian', 'bulgarian', 'romanian', 'hungarian',
    'greek', 'turkish', 'mediterranean', 'balkan food', 'balkan cuisine',
    'pita', 'lepinja', 'somun', 'kifla', 'kiflice', 'pogaca',
    'sarma', 'musaka', 'sogan dolma', 'dolma', 'grah', 'pasulj',
    'prebranac', 'sataraš', 'paprikaš', 'gulaš', 'čorba', 'supa',
    'kisela juha', 'kisela čorba', 'kisela supa', 'kisela juha',
    'kisela čorba', 'kisela supa', 'kisela juha', 'kisela čorba',
    'kisela supa', 'kisela juha', 'kisela čorba', 'kisela supa',

    // Meats
    'meat', 'chicken', 'beef', 'pork', 'steak', 'burger', 'hamburger', 'cheeseburger',
    'sausage', 'bacon', 'ham', 'turkey', 'lamb', 'veal', 'patty', 'meatball',
    'kebab', 'barbecue', 'bbq', 'grilled', 'fried chicken', 'nuggets',
    'wings', 'drumsticks', 'breast', 'thigh', 'ribs', 'chops',
    'roast', 'fillet', 'tenderloin', 'sirloin', 'ribeye', 't-bone',
    'ground meat', 'minced meat', 'schnitzel', 'cutlet', 'escalope',
    'meatloaf', 'bologna', 'salami', 'pepperoni', 'prosciutto',
    'pancetta', 'chorizo', 'pastrami', 'corned beef', 'jerky',

    // Seafood
    'fish', 'seafood', 'salmon', 'tuna', 'shrimp', 'prawn', 'crab', 'lobster',
    'oyster', 'mussel', 'clam', 'squid', 'octopus', 'anchovy', 'sardine',
    'mackerel', 'trout', 'cod', 'halibut', 'sea bass', 'tilapia',
    'catfish', 'swordfish', 'scallop', 'caviar', 'roe', 'sushi',
    'sashimi', 'ceviche', 'fish and chips', 'fish fillet', 'fish steak',

    // Vegetables
    'vegetable', 'salad', 'lettuce', 'tomato', 'cucumber', 'carrot', 'potato',
    'onion', 'garlic', 'pepper', 'broccoli', 'spinach', 'cabbage', 'mushroom',
    'zucchini', 'eggplant', 'corn', 'peas', 'beans', 'celery', 'radish',
    'beet', 'turnip', 'parsnip', 'sweet potato', 'yam', 'pumpkin',
    'squash', 'asparagus', 'artichoke', 'cauliflower', 'brussels sprouts',
    'kale', 'collard greens', 'mustard greens', 'swiss chard', 'bok choy',
    'watercress', 'arugula', 'endive', 'fennel', 'leek', 'shallot',
    'scallion', 'green onion', 'chive', 'parsley', 'cilantro', 'basil',
    'thyme', 'rosemary', 'sage', 'oregano', 'mint', 'dill',

    // Fruits
    'fruit', 'apple', 'banana', 'orange', 'grape', 'strawberry', 'berry',
    'pear', 'peach', 'plum', 'cherry', 'watermelon', 'melon', 'pineapple',
    'mango', 'kiwi', 'avocado', 'pomegranate', 'fig', 'date', 'prune',
    'raisin', 'cranberry', 'blueberry', 'raspberry', 'blackberry',
    'currant', 'gooseberry', 'elderberry', 'mulberry', 'boysenberry',
    'coconut', 'passion fruit', 'guava', 'papaya', 'dragon fruit',
    'star fruit', 'persimmon', 'lychee', 'rambutan', 'durian',
    'jackfruit', 'breadfruit', 'plantain', 'lime', 'lemon', 'grapefruit',
    'tangerine', 'mandarin', 'clementine', 'kumquat', 'apricot',
    'nectarine', 'quince', 'rhubarb',

    // Grains & Breads
    'bread', 'toast', 'sandwich', 'bun', 'roll', 'bagel', 'croissant',
    'pasta', 'noodle', 'rice', 'grain', 'cereal', 'oatmeal', 'pancake',
    'waffle', 'tortilla', 'wrap', 'pita', 'naan', 'focaccia', 'ciabatta',
    'sourdough', 'rye', 'whole wheat', 'multigrain', 'baguette', 'brioche',
    'challah', 'pumpernickel', 'matzo', 'lavash', 'flatbread', 'cracker',
    'pretzel', 'muffin', 'scone', 'biscuit', 'danish', 'strudel',
    'quinoa', 'couscous', 'bulgur', 'barley', 'millet', 'amaranth',
    'buckwheat', 'spelt', 'farro', 'polenta', 'grits', 'cornmeal',

    // Dairy & Eggs
    'milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg', 'omelette',
    'cottage cheese', 'ricotta', 'mozzarella', 'cheddar', 'parmesan',
    'feta', 'brie', 'camembert', 'gouda', 'swiss', 'provolone',
    'blue cheese', 'gorgonzola', 'roquefort', 'cream cheese', 'sour cream',
    'whipped cream', 'ice cream', 'gelato', 'sorbet', 'pudding',
    'custard', 'flan', 'panna cotta', 'mascarpone', 'quark',
    'kefir', 'buttermilk', 'condensed milk', 'evaporated milk',
    'powdered milk', 'almond milk', 'soy milk', 'oat milk', 'coconut milk',

    // Fast Food & Snacks
    'pizza', 'burger', 'fries', 'chips', 'snack', 'sandwich', 'hotdog',
    'taco', 'burrito', 'nachos', 'popcorn', 'pretzel', 'nuggets',
    'wings', 'mozzarella sticks', 'onion rings', 'chicken tenders',
    'fish sticks', 'corn dog', 'chili dog', 'cheese dog', 'bratwurst',
    'sausage roll', 'sausage sandwich', 'meatball sub', 'philly cheesesteak',
    'reuben', 'club sandwich', 'blt', 'grilled cheese', 'panini',
    'wrap', 'burrito bowl', 'taco salad', 'nachos', 'quesadilla',
    'empanada', 'calzone', 'stromboli', 'pizza roll', 'pizza pocket',
    'pizza bagel', 'pizza bites', 'pizza sticks', 'pizza fries',
    'pizza chips', 'pizza pretzel', 'pizza waffle', 'pizza pancake',

    // Desserts & Sweets
    'dessert', 'cake', 'pie', 'cookie', 'chocolate', 'ice cream', 'candy',
    'sweet', 'pastry', 'donut', 'muffin', 'brownie', 'cheesecake',
    'tiramisu', 'pudding', 'custard', 'flan', 'panna cotta',
    'mousse', 'souffle', 'creme brulee', 'tart', 'eclair', 'profiterole',
    'cannoli', 'baklava', 'strudel', 'croissant', 'danish', 'scone',
    'biscuit', 'shortbread', 'gingerbread', 'fruitcake', 'pound cake',
    'sponge cake', 'angel food cake', 'devil food cake', 'carrot cake',
    'red velvet cake', 'chocolate cake', 'coffee cake', 'banana bread',
    'zucchini bread', 'pumpkin bread', 'cornbread', 'muffin', 'cupcake',
    'brownie', 'blondie', 'cookie', 'biscotti', 'macaron', 'meringue',
    'fudge', 'toffee', 'caramel', 'nougat', 'marshmallow', 'gumdrop',
    'jelly bean', 'licorice', 'candy cane', 'lollipop', 'gummy bear',
    'gummy worm', 'chocolate bar', 'chocolate truffle', 'chocolate bonbon',
    'chocolate covered', 'chocolate dipped', 'chocolate coated',

    // Beverages
    'drink', 'beverage', 'coffee', 'tea', 'juice', 'soda', 'water',
    'smoothie', 'milkshake', 'cocktail', 'beer', 'wine', 'espresso',
    'cappuccino', 'latte', 'mocha', 'americano', 'macchiato', 'frappuccino',
    'hot chocolate', 'cocoa', 'chocolate milk', 'almond milk', 'soy milk',
    'oat milk', 'coconut milk', 'rice milk', 'hemp milk', 'cashew milk',
    'lemonade', 'limeade', 'orange juice', 'apple juice', 'grape juice',
    'cranberry juice', 'tomato juice', 'vegetable juice', 'smoothie',
    'protein shake', 'energy drink', 'sports drink', 'vitamin water',
    'sparkling water', 'mineral water', 'spring water', 'purified water',
    'distilled water', 'seltzer', 'tonic water', 'club soda', 'ginger ale',
    'root beer', 'cream soda', 'orange soda', 'grape soda', 'lemon-lime soda',
    'cola', 'diet cola', 'cherry cola', 'vanilla cola', 'coffee cola',
    'beer', 'lager', 'ale', 'stout', 'porter', 'pilsner', 'wheat beer',
    'hefeweizen', 'ipa', 'pale ale', 'amber ale', 'brown ale', 'red ale',
    'wine', 'red wine', 'white wine', 'rose wine', 'sparkling wine',
    'champagne', 'prosecco', 'cava', 'sake', 'mead', 'cider',
    'hard cider', 'cocktail', 'martini', 'margarita', 'mojito',
    'daiquiri', 'pina colada', 'mai tai', 'old fashioned', 'manhattan',
    'whiskey sour', 'moscow mule', 'bloody mary', 'mimosa', 'bellini'
];

// Common food mappings for generic tags
const foodMappings = {
    'food': null, // Skip generic "food" tag
    'meal': null, // Skip generic "meal" tag
    'dish': null, // Skip generic "dish" tag
    'fast food': null, // Don't default to burger anymore
    'junk food': null, // Don't default to burger anymore
    'finger food': 'snack',
    'produce': 'vegetable',
    'meat': 'beef',
    'bun': 'hamburger bun',
    'bread': 'sandwich bread',
    'patty': 'beef patty',
    'ground beef': 'beef patty',
    'sandwich': 'hamburger',
    'plate': null, // Skip plate detection
    'table': null, // Skip table detection
    
    // Fast food chain mappings with specific items
    'kfc': 'fried chicken',
    'kentucky fried chicken': 'fried chicken',
    'kentucky': 'fried chicken',
    'fried chicken': 'kfc fried chicken',
    'chicken bucket': 'kfc fried chicken',
    'chicken pieces': 'kfc fried chicken',
    'chicken wings': 'kfc wings',
    'chicken nuggets': 'kfc nuggets',
    'chicken tenders': 'kfc tenders',
    'chicken sandwich': 'kfc sandwich',
    'chicken burger': 'kfc sandwich',
    'chicken fillet': 'kfc sandwich',
    'chicken breast': 'kfc sandwich',
    'chicken thigh': 'kfc fried chicken',
    'chicken drumstick': 'kfc fried chicken',
    'chicken leg': 'kfc fried chicken',
    'chicken meal': 'kfc fried chicken',
    'chicken dinner': 'kfc fried chicken',
    'chicken box': 'kfc fried chicken',
    'chicken combo': 'kfc fried chicken',
    'chicken family meal': 'kfc fried chicken',
    'chicken bucket meal': 'kfc fried chicken',
    'chicken bucket dinner': 'kfc fried chicken',
    'chicken bucket combo': 'kfc fried chicken',
    'chicken bucket family meal': 'kfc fried chicken',
    'chicken bucket box': 'kfc fried chicken',
    'chicken bucket pack': 'kfc fried chicken',
    'chicken bucket deal': 'kfc fried chicken',
    'chicken bucket special': 'kfc fried chicken',
    'chicken bucket value': 'kfc fried chicken',
    'chicken bucket value meal': 'kfc fried chicken',
    'chicken bucket value dinner': 'kfc fried chicken',
    'chicken bucket value combo': 'kfc fried chicken',
    'chicken bucket value family meal': 'kfc fried chicken',
    'chicken bucket value box': 'kfc fried chicken',
    'chicken bucket value pack': 'kfc fried chicken',
    'chicken bucket value deal': 'kfc fried chicken',
    'chicken bucket value special': 'kfc fried chicken',
    
    // Other fast food chains
    'mcdonalds': 'big mac',
    'mcdonalds burger': 'big mac',
    'mcdonalds sandwich': 'big mac',
    'mcdonalds meal': 'big mac meal',
    'mcdonalds combo': 'big mac meal',
    'mcdonalds value meal': 'big mac meal',
    'mcdonalds value combo': 'big mac meal',
    'mcdonalds value pack': 'big mac meal',
    'mcdonalds value deal': 'big mac meal',
    'mcdonalds value special': 'big mac meal',
    
    'burger king': 'whopper',
    'burger king burger': 'whopper',
    'burger king sandwich': 'whopper',
    'burger king meal': 'whopper meal',
    'burger king combo': 'whopper meal',
    'burger king value meal': 'whopper meal',
    'burger king value combo': 'whopper meal',
    'burger king value pack': 'whopper meal',
    'burger king value deal': 'whopper meal',
    'burger king value special': 'whopper meal',
    
    // Balkan specific mappings
    'balkan food': 'cevapi',
    'balkan cuisine': 'cevapi',
    'bosnian food': 'cevapi',
    'serbian food': 'pljeskavica',
    'croatian food': 'cevapi',
    'montenegrin food': 'cevapi',
    'slovenian food': 'kranjska klobasa',
    'macedonian food': 'tavce gravce',
    'bulgarian food': 'banitsa',
    'romanian food': 'sarmale',
    'hungarian food': 'goulash',
    'greek food': 'moussaka',
    'turkish food': 'kebab',
    'mediterranean food': 'kebab',
};

async function analyzeWithAzureVision(base64Image) {
    try {
        // Convert base64 back to binary
        const imageBuffer = Buffer.from(base64Image, 'base64');

        const response = await fetch(
            `${AZURE_VISION_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags,Objects&language=en`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': AZURE_VISION_KEY
                },
                body: imageBuffer
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Azure Vision API error:', errorText);
            return null;
        }

        const data = await response.json();
        console.log('Azure Vision API response:', data);
        
        // Combine and process results
        const results = [];

        // Process tags with improved food detection
        if (data.tags) {
            data.tags.forEach(tag => {
                const tagName = tag.name.toLowerCase();
                
                // Skip if it's in the non-food items list
                if (commonNonFoodItems.some(item => tagName.includes(item))) {
                    return;
                }

                // Check if this tag is a food item or matches food keywords
                const isFoodRelated = foodKeywords.some(keyword => tagName.includes(keyword.toLowerCase()));
                
                if (isFoodRelated && tag.confidence > 0.5) {
                    // Check if we have a mapping for this tag
                    const mappedFood = foodMappings[tagName];
                    if (mappedFood !== null) { // null means we should skip this tag
                        // Increase confidence for chain-specific foods
                        let confidence = tag.confidence;
                        if (tagName.includes('kfc') || tagName.includes('kentucky')) {
                            confidence = Math.min(confidence + 0.3, 1.0);
                        }
                        results.push({
                            label: mappedFood || tagName,
                            score: confidence
                        });
                    }
                }
            });
        }

        // Process objects with the same improved logic
        if (data.objects) {
            data.objects.forEach(obj => {
                const objName = obj.object.toLowerCase();
                
                // Skip if it's in the non-food items list
                if (commonNonFoodItems.some(item => objName.includes(item))) {
                    return;
                }

                // Check if this object is a food item or matches food keywords
                const isFoodRelated = foodKeywords.some(keyword => objName.includes(keyword.toLowerCase()));
                
                if (isFoodRelated && obj.confidence > 0.5) {
                    // Check if we have a mapping for this object
                    const mappedFood = foodMappings[objName];
                    if (mappedFood !== null) { // null means we should skip this tag
                        // Increase confidence for chain-specific foods
                        let confidence = obj.confidence;
                        if (objName.includes('kfc') || objName.includes('kentucky')) {
                            confidence = Math.min(confidence + 0.3, 1.0);
                        }
                        results.push({
                            label: mappedFood || objName,
                            score: confidence
                        });
                    }
                }
            });
        }

        // Remove duplicates and sort by confidence
        const uniqueResults = Array.from(new Set(results.map(r => r.label)))
            .map(label => {
                const items = results.filter(r => r.label === label);
                return {
                    label: label,
                    score: Math.max(...items.map(i => i.score))
                };
            })
            .sort((a, b) => b.score - a.score);

        return uniqueResults;
    } catch (error) {
        console.error('Error calling Azure Vision API:', error);
        return null;
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const foodDescription = formData.get('foodDescription');
        const manualInput = formData.get('manualInput');
        const manualFoodName = formData.get('manualFoodName');
        const manualServingSize = formData.get('manualServingSize');
        const manualServingUnit = formData.get('manualServingUnit');
        const manualDescription = formData.get('manualDescription');

        // If manual input is provided, skip image analysis
        if (manualInput === 'true' && manualFoodName) {
            // Validate required fields
            if (!manualServingSize || !manualServingUnit) {
                return NextResponse.json(
                    { error: 'Please provide both serving size and unit' },
                    { status: 400 }
                );
            }

            // Try multiple databases for the best result
            const nutritionalInfo = await getBestNutritionalInfo(manualFoodName);
            
            if (!nutritionalInfo) {
                return NextResponse.json(
                    { error: 'Could not find nutritional information for this food in any database' },
                    { status: 404 }
                );
            }

            // Override the serving size and unit with manual input
            nutritionalInfo.servingSize = parseFloat(manualServingSize);
            nutritionalInfo.servingUnit = manualServingUnit;
            if (manualDescription) {
                nutritionalInfo.description = manualDescription;
            }

            // Adjust nutritional values based on the new serving size
            const servingRatio = nutritionalInfo.servingSize / nutritionalInfo.servingWeight;
            nutritionalInfo.calories = Math.round(nutritionalInfo.calories * servingRatio);
            nutritionalInfo.proteins = +(nutritionalInfo.proteins * servingRatio).toFixed(1);
            nutritionalInfo.carbs = +(nutritionalInfo.carbs * servingRatio).toFixed(1);
            nutritionalInfo.fats = +(nutritionalInfo.fats * servingRatio).toFixed(1);
            nutritionalInfo.fiber = +(nutritionalInfo.fiber * servingRatio).toFixed(1);
            nutritionalInfo.sugar = +(nutritionalInfo.sugar * servingRatio).toFixed(1);
            nutritionalInfo.sodium = Math.round(nutritionalInfo.sodium * servingRatio);
            nutritionalInfo.potassium = Math.round(nutritionalInfo.potassium * servingRatio);

            return NextResponse.json({
                foodName: manualFoodName,
                confidence: 1.0,
                ...nutritionalInfo
            });
        }

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided. Please upload an image or use manual input.' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload an image file (JPEG, PNG, etc.).' },
                { status: 400 }
            );
        }

        // Convert the file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        let analysisResult = null;
        let nutritionalInfo = null;

        // Try image analysis first
        try {
            const visionResults = await analyzeWithAzureVision(base64Image);
            
            if (visionResults && visionResults.length > 0) {
                analysisResult = {
                    foodName: visionResults[0].label,
                    confidence: visionResults[0].score
                };
            }
        } catch (error) {
            console.error('Image analysis error:', error);
        }

        // If image analysis failed but we have a food description, use that instead
        if (!analysisResult && foodDescription) {
            console.log('Using food description as fallback:', foodDescription);
            analysisResult = {
                foodName: foodDescription,
                confidence: 0.8
            };
        }

        if (!analysisResult) {
            return NextResponse.json(
                { error: 'Could not identify food in the image. Please try again with a clearer image or use manual input.' },
                { status: 400 }
            );
        }

        const { foodName, confidence } = analysisResult;

        // If we have a food description, use it to improve the result
        if (foodDescription) {
            const descriptionWords = foodDescription.toLowerCase().split(' ');
            const currentLabel = foodName.toLowerCase();
            
            // If the description contains words that match the current label, increase confidence
            if (descriptionWords.some(word => currentLabel.includes(word))) {
                analysisResult.confidence = Math.min(confidence + 0.3, 1.0);
            }
        }

        const isLikelyNonFood = commonNonFoodItems.some(item => 
            foodName.toLowerCase().includes(item.toLowerCase())
        );

        if (isLikelyNonFood) {
            return NextResponse.json(
                { error: 'The image appears to contain a non-food item. Please provide a clear image of food or use manual input.' },
                { status: 400 }
            );
        }

        // Get detailed nutritional information from multiple sources
        nutritionalInfo = await getBestNutritionalInfo(foodName);

        if (!nutritionalInfo) {
            return NextResponse.json(
                { error: `Could not find nutritional information for "${foodName}". Please try manual input or a different food item.` },
                { status: 404 }
            );
        }

        // Additional validation: check if the nutritional values make sense
        if (!isValidNutritionalInfo(nutritionalInfo)) {
            return NextResponse.json(
                { error: 'The nutritional information seems incorrect. Please try manual input or a different food item.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            foodName,
            confidence,
            ...nutritionalInfo
        });

    } catch (error) {
        console.error('Error analyzing food:', error);
        return NextResponse.json(
            { error: 'An error occurred while analyzing the food. Please try again or use manual input.' },
            { status: 500 }
        );
    }
}

async function getBestNutritionalInfo(foodName) {
    try {
        // Try multiple databases in parallel
        const [usdaInfo, nutritionixInfo, openFoodFactsInfo] = await Promise.all([
            getUSDAInfo(foodName),
            getNutritionixInfo(foodName),
            getOpenFoodFactsInfo(foodName)
        ]);

        // Combine and select the best information
        const combinedInfo = combineNutritionalInfo(usdaInfo, nutritionixInfo, openFoodFactsInfo);
        return combinedInfo;
    } catch (error) {
        console.error('Error fetching nutritional info:', error);
        return null;
    }
}

async function getUSDAInfo(foodName) {
    try {
        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(foodName)}&pageSize=1`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) return null;
        const data = await response.json();
        
        if (!data.foods || data.foods.length === 0) return null;

        const food = data.foods[0];
        const nutrients = food.foodNutrients;
        
        const findNutrient = (id) => {
            const nutrient = nutrients.find(n => n.nutrientId === id);
            return nutrient ? nutrient.value : 0;
        };

        return {
            source: 'USDA',
            confidence: 0.8,
            calories: findNutrient(1008),
            proteins: findNutrient(1003),
            carbs: findNutrient(1005),
            fats: findNutrient(1004),
            fiber: findNutrient(1079),
            sugar: findNutrient(2000),
            sodium: findNutrient(1093),
            servingSize: food.servingSize || 100,
            servingUnit: food.servingSizeUnit || 'g',
            servingWeight: food.servingSize || 100,
            brandName: food.brandName || 'Generic',
            description: food.description || foodName,
            // Additional nutrients
            saturatedFat: findNutrient(1258),
            cholesterol: findNutrient(1253),
            potassium: findNutrient(1092),
            vitaminA: findNutrient(1106),
            vitaminC: findNutrient(1162),
            calcium: findNutrient(1087),
            iron: findNutrient(1089),
            // More detailed nutrients
            magnesium: findNutrient(1090),
            zinc: findNutrient(1095),
            vitaminD: findNutrient(1114),
            vitaminE: findNutrient(1158),
            vitaminK: findNutrient(1185),
            thiamin: findNutrient(1165),
            riboflavin: findNutrient(1166),
            niacin: findNutrient(1167),
            vitaminB6: findNutrient(1175),
            folate: findNutrient(1177),
            vitaminB12: findNutrient(1178),
            phosphorus: findNutrient(1091),
            selenium: findNutrient(1103),
            copper: findNutrient(1098),
            manganese: findNutrient(1101),
            caffeine: findNutrient(1057),
            alcohol: findNutrient(1018),
            water: findNutrient(1051),
            ash: findNutrient(1007)
        };
    } catch (error) {
        console.error('Error fetching USDA info:', error);
        return null;
    }
}

async function getNutritionixInfo(foodName) {
    try {
        const response = await fetch(
            'https://trackapi.nutritionix.com/v2/natural/nutrients',
            {
                method: 'POST',
                headers: {
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: foodName,
                    timezone: "US/Eastern"
                }),
            }
        );

        if (!response.ok) return null;
        const data = await response.json();
        
        if (!data.foods || data.foods.length === 0) return null;

        const food = data.foods[0];
        return {
            source: 'Nutritionix',
            confidence: 0.7,
            calories: food.nf_calories || 0,
            proteins: food.nf_protein || 0,
            carbs: food.nf_total_carbohydrate || 0,
            fats: food.nf_total_fat || 0,
            fiber: food.nf_dietary_fiber || 0,
            sugar: food.nf_sugars || 0,
            sodium: food.nf_sodium || 0,
            servingSize: food.serving_qty || 1,
            servingUnit: food.serving_unit || 'serving',
            servingWeight: food.serving_weight_grams || 0,
            brandName: food.brand_name || 'Generic',
            description: food.food_name || foodName,
            saturatedFat: food.nf_saturated_fat || 0,
            cholesterol: food.nf_cholesterol || 0,
            potassium: food.nf_potassium || 0,
            vitaminA: food.full_nutrients?.find(n => n.attr_id === 320)?.value || 0,
            vitaminC: food.full_nutrients?.find(n => n.attr_id === 401)?.value || 0,
            calcium: food.full_nutrients?.find(n => n.attr_id === 301)?.value || 0,
            iron: food.full_nutrients?.find(n => n.attr_id === 303)?.value || 0
        };
    } catch (error) {
        console.error('Error fetching Nutritionix info:', error);
        return null;
    }
}

async function getOpenFoodFactsInfo(foodName) {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) return null;
        const data = await response.json();
        
        if (!data.products || data.products.length === 0) return null;

        const product = data.products[0];
        const nutriments = product.nutriments || {};
        
        return {
            source: 'OpenFoodFacts',
            confidence: 0.75,
            calories: nutriments['energy-kcal_100g'] || 0,
            proteins: nutriments.proteins_100g || 0,
            carbs: nutriments.carbohydrates_100g || 0,
            fats: nutriments.fat_100g || 0,
            fiber: nutriments.fiber_100g || 0,
            sugar: nutriments.sugars_100g || 0,
            sodium: (nutriments.sodium_100g || 0) * 1000, // Convert to mg
            servingSize: 100,
            servingUnit: 'g',
            servingWeight: 100,
            brandName: product.brands || 'Generic',
            description: product.product_name || foodName,
            saturatedFat: nutriments['saturated-fat_100g'] || 0,
            cholesterol: nutriments.cholesterol_100g || 0,
            potassium: nutriments.potassium_100g || 0,
            vitaminA: nutriments['vitamin-a_100g'] || 0,
            vitaminC: nutriments['vitamin-c_100g'] || 0,
            calcium: nutriments.calcium_100g || 0,
            iron: nutriments.iron_100g || 0,
            // Additional nutrients
            magnesium: nutriments.magnesium_100g || 0,
            zinc: nutriments.zinc_100g || 0,
            vitaminD: nutriments['vitamin-d_100g'] || 0,
            vitaminE: nutriments['vitamin-e_100g'] || 0,
            vitaminK: nutriments['vitamin-k_100g'] || 0,
            thiamin: nutriments['vitamin-b1_100g'] || 0,
            riboflavin: nutriments['vitamin-b2_100g'] || 0,
            niacin: nutriments['vitamin-b3_100g'] || 0,
            vitaminB6: nutriments['vitamin-b6_100g'] || 0,
            folate: nutriments['vitamin-b9_100g'] || 0,
            vitaminB12: nutriments['vitamin-b12_100g'] || 0,
            phosphorus: nutriments.phosphorus_100g || 0,
            selenium: nutriments.selenium_100g || 0,
            copper: nutriments.copper_100g || 0,
            manganese: nutriments.manganese_100g || 0,
            caffeine: nutriments.caffeine_100g || 0,
            alcohol: nutriments.alcohol_100g || 0,
            water: nutriments.water_100g || 0,
            ash: nutriments.ash_100g || 0
        };
    } catch (error) {
        console.error('Error fetching OpenFoodFacts info:', error);
        return null;
    }
}

function combineNutritionalInfo(usdaInfo, nutritionixInfo, openFoodFactsInfo) {
    const sources = [usdaInfo, nutritionixInfo, openFoodFactsInfo].filter(Boolean);
    if (sources.length === 0) return null;

    // Sort sources by confidence
    sources.sort((a, b) => b.confidence - a.confidence);

    // Use the highest confidence source as base
    const baseInfo = sources[0];

    // Combine information from all sources, preferring higher confidence values
    const combinedInfo = { ...baseInfo };
    
    // For each nutrient, use the value from the source with highest confidence
    const nutrients = [
        'calories', 'proteins', 'carbs', 'fats', 'fiber', 'sugar', 'sodium',
        'saturatedFat', 'cholesterol', 'potassium', 'vitaminA', 'vitaminC',
        'calcium', 'iron'
    ];

    nutrients.forEach(nutrient => {
        const values = sources
            .filter(s => s[nutrient] !== undefined && s[nutrient] !== 0)
            .map(s => ({ value: s[nutrient], confidence: s.confidence }));
        
        if (values.length > 0) {
            // Use weighted average if multiple sources have values
            const totalConfidence = values.reduce((sum, v) => sum + v.confidence, 0);
            combinedInfo[nutrient] = values.reduce((sum, v) => 
                sum + (v.value * v.confidence / totalConfidence), 0);
        }
    });

    // Round numeric values
    Object.keys(combinedInfo).forEach(key => {
        if (typeof combinedInfo[key] === 'number') {
            combinedInfo[key] = Number(combinedInfo[key].toFixed(1));
        }
    });

    return combinedInfo;
}

function isValidNutritionalInfo(info) {
    // Check if the nutritional values are within reasonable ranges
    const checks = [
        info.calories > 0 && info.calories < 2000, // Most single food items shouldn't exceed 2000 calories
        info.proteins >= 0 && info.proteins < 100, // Most foods don't have more than 100g protein
        info.carbs >= 0 && info.carbs < 200, // Most foods don't have more than 200g carbs
        info.fats >= 0 && info.fats < 100, // Most foods don't have more than 100g fat
        info.sugar >= 0 && info.sugar < 100, // Most foods don't have more than 100g sugar
        info.sodium >= 0 && info.sodium < 5000, // Most foods don't have more than 5000mg sodium
        info.fiber >= 0 && info.fiber < 50, // Most foods don't have more than 50g fiber
    ];

    // All checks must pass
    return checks.every(check => check === true);
} 