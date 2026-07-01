
// Drill Types and Questions
export const DRILL_TYPES = [
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    description: 'Practice Drop, Cover, and Hold On procedures.',
    questions: [
      {
        id: 1,
        question: "What is the first thing you should do during an earthquake?",
        options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in a doorway", "Call 112"],
        correct: 1,
        category: 'Response'
      },
      {
        id: 2,
        question: "If you are in bed during an earthquake, you should:",
        options: ["Roll onto the floor", "Stay there and cover your head with a pillow", "Run to the window", "Hide under the bed"],
        correct: 1,
        category: 'Response'
      },
      {
        id: 3,
        question: "After the shaking stops, what should you expect?",
        options: ["Tsunamis (if near coast)", "Aftershocks", "Gas leaks", "All of the above"],
        correct: 3,
        category: 'Awareness'
      },
      {
        id: 4,
        question: "If you are outdoors, you should move away from:",
        options: ["Buildings", "Streetlights", "Utility wires", "All of the above"],
        correct: 3,
        category: 'Awareness'
      },
      {
        id: 5,
        question: "What is the 'Triangle of Life' theory status?",
        options: ["Proven and recommended", "Controversial and not recommended by experts", "The only way to survive", "Used only in Japan"],
        correct: 1,
        category: 'Knowledge'
      }
    ]
  },
  {
    id: 'flood',
    title: 'Flood Response',
    description: 'Learn how to react to rising water levels and flash floods.',
    questions: [
      {
        id: 1,
        question: "If you are caught in a flood, you should:",
        options: ["Walk through the water", "Drive through the water", "Move to higher ground", "Stay in your basement"],
        correct: 2,
        category: 'Response'
      },
      {
        id: 2,
        question: "How much moving water is needed to knock a person down?",
        options: ["6 inches", "1 foot", "2 feet", "3 feet"],
        correct: 0,
        category: 'Knowledge'
      },
      {
        id: 3,
        question: "What is a 'Flash Flood'?",
        options: ["A flood that happens at night", "A flood caused by a camera flash", "A rapid flooding of low-lying areas", "A slow rising river"],
        correct: 2,
        category: 'Awareness'
      },
      {
        id: 4,
        question: "If your car stalls in rising water, you should:",
        options: ["Stay inside and wait", "Abandon it immediately and seek higher ground", "Try to restart it", "Call a mechanic"],
        correct: 1,
        category: 'Response'
      },
      {
        id: 5,
        question: "Flood water can be contaminated with:",
        options: ["Sewage", "Chemicals", "Debris", "All of the above"],
        correct: 3,
        category: 'Awareness'
      }
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    description: 'Master evacuation routes and fire safety protocols.',
    questions: [
      {
        id: 1,
        question: "If your clothes catch fire, what should you do?",
        options: ["Run fast", "Stop, Drop, and Roll", "Wave your arms", "Pour water on yourself immediately"],
        correct: 1,
        category: 'Response'
      },
      {
        id: 2,
        question: "To check if a door is hot, use:",
        options: ["The palm of your hand", "The back of your hand", "Your foot", "A thermometer"],
        correct: 1,
        category: 'Response'
      },
      {
        id: 3,
        question: "Smoke rises, so you should:",
        options: ["Walk normally", "Crawl low under the smoke", "Run", "Jump"],
        correct: 1,
        category: 'Awareness'
      },
      {
        id: 4,
        question: "What is the PASS method for fire extinguishers?",
        options: ["Pull, Aim, Squeeze, Sweep", "Push, Aim, Squeeze, Sweep", "Pull, Aim, Shoot, Spray", "Point, Aim, Shoot, Sweep"],
        correct: 0,
        category: 'Resources'
      },
      {
        id: 5,
        question: "Where should your family meet after evacuating?",
        options: ["At the movies", "At a designated meeting place outside", "In the kitchen", "In the garage"],
        correct: 1,
        category: 'Response'
      }
    ]
  }
];

// Local Storage Keys (Fallback)
const DRILL_RESULTS_KEY = 'sih_drill_results';
import { ref, push, onValue, set } from 'firebase/database';
import { db } from '../firebase/config';

export const saveDrillResult = async (result) => {
  try {
    const newResult = {
      ...result,
      timestamp: Date.now()
    };
    
    // Push to Firebase
    const resultsRef = ref(db, 'drill_results');
    await push(resultsRef, newResult);
    
    // Also save to local storage for offline fallback/history
    const existingResults = JSON.parse(localStorage.getItem(DRILL_RESULTS_KEY) || '[]');
    existingResults.unshift({ ...newResult, id: 'local-' + Date.now() });
    localStorage.setItem(DRILL_RESULTS_KEY, JSON.stringify(existingResults));
    
    return true;
  } catch (error) {
    console.error("Failed to save drill result", error);
    return false;
  }
};

// Now returns a cleanup function (unsubscribe) if used with a callback, 
// or returns local data if no callback (legacy support with warning)
export const getDrillResults = (callback) => {
  if (callback) {
    const resultsRef = ref(db, 'drill_results');
    const unsubscribe = onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const resultsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        callback(resultsArray);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  } else {
    // Fallback to local storage if no callback provided (synchronous usage)
    try {
      return JSON.parse(localStorage.getItem(DRILL_RESULTS_KEY) || '[]');
    } catch (error) {
      console.error("Failed to get drill results locally", error);
      return [];
    }
  }
};

export const getDrillTypes = () => DRILL_TYPES;
