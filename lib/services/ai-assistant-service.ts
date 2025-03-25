"use client";

import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Topic {
  id: string;
  name: string;
  status: "not-started" | "in-progress" | "completed";
  estimatedTime: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "textbook" | "notes" | "video" | "problems" | "article";
  link: string;
}

export interface StudyPlan {
  id: string;
  subject: string;
  topics: Topic[];
  resources: Resource[];
  createdAt: string;
}

export interface SavedPrompt {
  id: string;
  text: string;
  savedAt: string;
}

const MESSAGES_STORAGE_KEY = "atena-ai-messages";
const STUDY_PLANS_STORAGE_KEY = "atena-ai-study-plans";
const SAVED_PROMPTS_STORAGE_KEY = "atena-ai-saved-prompts";

// Mock AI response generator
const generateAIResponse = async (prompt: string): Promise<string> => {
  // In a real implementation, this would call an API to get a response from an AI model
  
  // For demo purposes, we'll use a simple mapping of prompts to responses
  const responses: Record<string, string> = {
    "explain quantum tunneling": "Quantum tunneling is a quantum mechanical phenomenon where a particle passes through a potential energy barrier that it classically could not surmount. This plays an essential role in several physical phenomena, such as nuclear fusion in stars, and has applications in modern technologies like the scanning tunneling microscope.\n\nIn classical mechanics, if a particle doesn't have enough energy to overcome a barrier, it will be reflected. However, in quantum mechanics, particles behave as waves with a probability distribution. When these waves encounter a barrier, there's a small but non-zero probability that the particle will 'tunnel' through to the other side, even if it lacks the energy to overcome the barrier classically.",
    
    "what is the heisenberg uncertainty principle": "The Heisenberg uncertainty principle is one of the cornerstones of quantum mechanics. It states that we cannot simultaneously know both the position and momentum of a particle with perfect precision. The more precisely we know the position, the less precisely we know the momentum, and vice versa.\n\nMathematically, it's expressed as: ΔxΔp ≥ ℏ/2, where Δx is the uncertainty in position, Δp is the uncertainty in momentum, and ℏ is the reduced Planck constant.\n\nThis principle isn't due to measurement limitations but is a fundamental property of quantum systems. It implies that at the quantum level, particles don't have well-defined positions and momenta simultaneously, challenging classical physics notions.",
    
    "create a study plan for quantum mechanics": "Here's a study plan for Quantum Mechanics:\n\n1. Foundations (Week 1):\n   - Classical vs. Quantum Physics\n   - Wave-Particle Duality\n   - Double-Slit Experiment\n\n2. Mathematical Framework (Week 2):\n   - Complex Numbers\n   - Linear Algebra Basics\n   - Hilbert Spaces\n\n3. Core Concepts (Weeks 3-4):\n   - Schrödinger Equation\n   - Wavefunctions\n   - Operators and Observables\n   - Heisenberg Uncertainty Principle\n\n4. Applications (Weeks 5-6):\n   - Quantum Tunneling\n   - Harmonic Oscillator\n   - Hydrogen Atom\n   - Spin and Angular Momentum\n\n5. Advanced Topics (Weeks 7-8):\n   - Quantum Entanglement\n   - Quantum Measurement\n   - Quantum Computing Basics\n\nRecommended Resources:\n- Textbook: 'Introduction to Quantum Mechanics' by David J. Griffiths\n- Online Course: MIT OpenCourseWare - Quantum Physics I\n- Practice Problems: 'Quantum Mechanics: Concepts and Applications' by Nouredine Zettili",
    
    "what are some effective study techniques": "Here are some effective study techniques backed by research:\n\n1. **Spaced Repetition**: Spread out study sessions over time rather than cramming. Review material at increasing intervals.\n\n2. **Retrieval Practice**: Test yourself regularly. Instead of re-reading, try to recall information from memory.\n\n3. **Interleaving**: Mix up different topics or problem types within a study session instead of focusing on just one.\n\n4. **Elaboration**: Ask yourself questions like \"Why does this make sense?\" and connect new information to what you already know.\n\n5. **Dual Coding**: Combine verbal and visual learning by using diagrams, sketches, or mental images.\n\n6. **The Pomodoro Technique**: Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.\n\n7. **Teach Someone Else**: Explaining concepts in your own words helps solidify understanding.\n\n8. **Create Mind Maps**: Organize information visually to see connections between concepts.\n\n9. **Use Mnemonics**: Create memory aids like acronyms or visualization techniques.\n\n10. **Active Reading**: Highlight, annotate, and summarize as you read rather than passively consuming information.",
    
    "mitosis vs meiosis": "**Mitosis vs. Meiosis: Key Differences**\n\n**Purpose:**\n- **Mitosis**: Produces genetically identical cells for growth, repair, and asexual reproduction\n- **Meiosis**: Creates genetically diverse gametes (egg/sperm) for sexual reproduction\n\n**Number of Divisions:**\n- **Mitosis**: Single division\n- **Meiosis**: Two sequential divisions (Meiosis I and II)\n\n**Final Cell Count:**\n- **Mitosis**: Two cells\n- **Meiosis**: Four cells\n\n**Chromosome Number:**\n- **Mitosis**: Cells maintain the same chromosome number (diploid → diploid)\n- **Meiosis**: Chromosome number is halved (diploid → haploid)\n\n**Genetic Variation:**\n- **Mitosis**: No genetic recombination, cells are genetically identical to parent cell\n- **Meiosis**: Includes crossing over and random chromosome alignment, producing genetically diverse cells\n\n**Cell Types:**\n- **Mitosis**: Occurs in somatic cells throughout the body\n- **Meiosis**: Only occurs in specialized cells in reproductive organs",
    
    "neural networks explained": "**Neural Networks Explained Simply**\n\nNeural networks are computing systems inspired by the human brain. Here's how they work:\n\n1. **Structure**: Think of a neural network as layers of connected nodes (like neurons). It has an input layer, hidden layers, and an output layer.\n\n2. **Learning Process**: \n   - The network takes in data through the input layer\n   - Each connection between nodes has a \"weight\" (importance)\n   - The network adjusts these weights based on how correct its predictions are\n   - Over time, it gets better at making predictions\n\n3. **Key Concepts**:\n   - **Neurons**: Process inputs and transmit signals if they're strong enough\n   - **Weights**: Determine how much influence one node has on another\n   - **Activation Functions**: Determine whether a neuron should be activated\n   - **Backpropagation**: How the network learns from mistakes\n\n4. **Real-World Applications**:\n   - Image and speech recognition\n   - Natural language processing\n   - Game playing\n   - Medical diagnoses\n   - Recommendation systems\n\nIn essence, neural networks recognize patterns in data, learn from examples, and make decisions or predictions without being explicitly programmed for specific tasks.",
    
    "world war ii summary": "**Key Events of World War II (1939-1945)**\n\n**Causes and Beginnings:**\n- Rise of fascism in Europe (Nazi Germany, Fascist Italy)\n- Germany's aggressive expansion and rearmament under Hitler\n- September 1, 1939: Germany invades Poland, Britain and France declare war\n\n**Early Axis Victories (1939-1942):**\n- Germany conquers much of Western Europe (Denmark, Norway, Belgium, Netherlands, France)\n- Battle of Britain: Failed German air campaign against UK\n- June 1941: Germany invades Soviet Union (Operation Barbarossa)\n- December 7, 1941: Japan attacks Pearl Harbor, US enters the war\n\n**Turning Points (1942-1943):**\n- Battles of Stalingrad and Kursk: Soviet victories against Germany\n- El Alamein: British victory in North Africa\n- Midway: US naval victory against Japan in the Pacific\n- Allied invasion of Italy, Mussolini deposed\n\n**Allied Victory (1944-1945):**\n- June 6, 1944: D-Day landings in Normandy\n- Liberation of Western Europe\n- Soviet advance toward Germany from the East\n- May 8, 1945: Germany surrenders (V-E Day)\n- August 6 & 9, 1945: Atomic bombings of Hiroshima and Nagasaki\n- September 2, 1945: Japan surrenders (V-J Day), war ends\n\n**Aftermath:**\n- Approximately 70-85 million deaths, including the Holocaust\n- United Nations established\n- Beginning of the Cold War between Western powers and Soviet bloc\n- Decolonization movements accelerate\n- Economic reconstruction (Marshall Plan in Europe)",
    
    "scientific method": "**The Scientific Method: Step by Step**\n\n1. **Ask a Question**\n   - Identify something you're curious about or a problem to solve\n   - The question should be clear, specific, and testable\n\n2. **Research**\n   - Gather existing knowledge on the topic\n   - Review literature, consult experts, and examine previous research\n\n3. **Formulate a Hypothesis**\n   - Create a testable prediction or explanation\n   - Usually stated as an \"If...then...\" statement\n   - Should be falsifiable (possible to disprove)\n\n4. **Test the Hypothesis**\n   - Design and conduct experiments to test your prediction\n   - Control variables to ensure valid results\n   - Collect data accurately and systematically\n\n5. **Analyze Data**\n   - Organize and examine your results\n   - Use statistical methods to determine significance\n   - Look for patterns and relationships\n\n6. **Draw Conclusions**\n   - Determine if your hypothesis is supported or refuted\n   - Assess the reliability of your findings\n   - Consider alternative explanations\n\n7. **Report Results**\n   - Share your findings with the scientific community\n   - Submit to peer review to validate your work\n\n8. **Refine, Retest, or Develop New Questions**\n   - Science is iterative; results often lead to new questions\n   - Other scientists may replicate your work to verify findings\n\nThe scientific method is a dynamic process rather than a fixed sequence. Scientists often move back and forth between steps as they refine their understanding.",
    
    "enzymes": "**How Enzymes Work in Cellular Processes**\n\nEnzymes are specialized proteins that act as biological catalysts, dramatically speeding up chemical reactions in cells without being consumed in the process.\n\n**Basic Function:**\n- Enzymes lower the activation energy needed for reactions to occur\n- They can increase reaction rates by millions of times\n- Without enzymes, most cellular reactions would happen too slowly to sustain life\n\n**How They Work:**\n1. **Lock and Key Model**: Enzymes have a specific 3D shape with an active site that fits specific molecules (substrates)\n2. **Induced Fit Model**: The enzyme slightly changes shape when the substrate binds, creating an even better fit\n\n**Enzyme-Substrate Interaction:**\n1. The substrate binds to the enzyme's active site\n2. The enzyme catalyzes the chemical reaction\n3. Products are formed and released\n4. The unchanged enzyme is free to bind with new substrates\n\n**Factors Affecting Enzyme Activity:**\n- **Temperature**: Each enzyme has an optimal temperature range\n- **pH**: Changes in pH can alter enzyme shape and function\n- **Substrate Concentration**: More substrate generally means faster reactions, up to a point\n- **Enzyme Concentration**: More enzymes can process more substrate molecules\n- **Inhibitors**: Molecules that reduce enzyme activity\n- **Cofactors/Coenzymes**: Non-protein components some enzymes need to function\n\n**Cellular Roles:**\n- **Metabolism**: Breaking down nutrients for energy (digestive enzymes)\n- **Synthesis**: Building cellular components (DNA polymerase)\n- **Detoxification**: Breaking down toxins (liver enzymes)\n- **Cell Signaling**: Activating or deactivating proteins in signaling pathways\n- **DNA Repair**: Fixing damaged DNA\n\nEnzymes are essential for virtually all cellular processes and are highly regulated to ensure proper cellular function.",
    
    "generate practice questions": "**Practice Questions on Your Current Topic**\n\nHere are some practice questions to test your understanding. I've included different question types to help with comprehensive learning:\n\n**Multiple Choice:**\n1. Which of the following best demonstrates the application of the key concept in a real-world scenario?\n   a) [Example 1]\n   b) [Example 2]\n   c) [Example 3]\n   d) [Example 4]\n\n**Short Answer:**\n2. Explain the relationship between [concept A] and [concept B] in your own words.\n3. What are the three main components of [the topic] and how do they interact?\n\n**Problem Solving:**\n4. Given [specific scenario], how would you apply [relevant method] to solve this problem?\n5. If [variable] changes by [amount], predict how this would affect the overall system.\n\n**Analysis:**\n6. Compare and contrast [theory X] and [theory Y]. What are their strengths and limitations?\n7. Analyze the following statement: \"[Controversial claim about the topic].\" What evidence supports or refutes this view?\n\n**Application:**\n8. Design a simple experiment to test [specific hypothesis related to the topic].\n9. How might the principles of [the topic] be applied to address [current real-world issue]?\n\n**Critical Thinking:**\n10. What are the ethical implications of [aspect of the topic]?\n11. If our current understanding of [the topic] is incorrect, what alternative explanations might exist?\n\nThese questions are designed to challenge different levels of understanding from basic recall to advanced application and evaluation. Try answering them without referring to your notes first, then review the material to fill in any gaps in your knowledge.",
    
    "learning style": "**Analysis of Learning Styles and Study Preferences**\n\nBased on your study preferences, here's an analysis of your potential learning style and recommendations to optimize your studying:\n\n**Your Learning Profile:**\n- You seem to have strengths in [visual/auditory/reading-writing/kinesthetic] learning\n- You tend to prefer [structured/flexible] learning environments\n- You work best [independently/collaboratively]\n- Your strongest learning contexts appear to be [classroom/self-study/discussion/practical application]\n\n**Optimization Strategies:**\n\n1. **Content Intake:**\n   - Prioritize [videos/lectures/readings/hands-on activities] for initial learning\n   - Supplement with [secondary learning method] to reinforce understanding\n   - Break complex topics into [smaller conceptual chunks/broader integrative frameworks]\n\n2. **Processing Information:**\n   - Use [mind maps/outlines/flashcards/teaching others] to organize information\n   - Allocate specific time for [reflection/application/review/questioning]\n   - Connect new information to existing knowledge through [analogies/examples/categorization]\n\n3. **Environment Optimization:**\n   - Create a study space with [specific environmental factors]  \n   - Study during your peak productivity hours ([morning/afternoon/evening])\n   - [Minimize/Use strategic] background noise or music\n\n4. **Retention Techniques:**\n   - Implement [spaced repetition/practice testing/elaborative interrogation]\n   - Create [visual aids/verbal summaries/written notes/physical models]\n   - Review material [immediately/after 24 hours/weekly/before exams]\n\nRemember that effective learning often involves multiple approaches. While understanding your preferences is valuable, research shows that matching challenges with slightly different learning approaches can enhance overall learning outcomes. The most effective studying typically integrates various methods rather than relying exclusively on preferred styles.",
    
    "create flashcards": "**Flashcards for Effective Study**\n\nHere are some well-structured flashcards for your topic. I've organized them by key concepts and included a variety of question types:\n\n**Key Terms & Definitions:**\n- FRONT: [Term 1]\n  BACK: [Concise definition with key characteristics]\n\n- FRONT: [Term 2]\n  BACK: [Definition with example for context]\n\n**Concepts & Explanations:**\n- FRONT: Explain the process of [concept]\n  BACK: [Step-by-step explanation, limited to essential points]\n\n- FRONT: What is the relationship between [concept A] and [concept B]?\n  BACK: [Clear explanation of relationship with key distinctions]\n\n**Formulas & Applications:**\n- FRONT: [Formula or equation]\n  BACK: [What each variable represents and when to use this formula]\n\n- FRONT: How do you solve [type of problem]?\n  BACK: [Method with brief example]\n\n**Compare & Contrast:**\n- FRONT: Differences between [concept X] and [concept Y]\n  BACK: [3-4 key differences in table format]\n\n**Sequences & Processes:**\n- FRONT: Steps in [process]\n  BACK: [Numbered list of steps]\n\n**Visual Elements:**\n- FRONT: Label the components of [diagram/structure]\n  BACK: [Labeled diagram]\n\n**Application Questions:**\n- FRONT: Real-world example of [concept]\n  BACK: [Brief example with explanation of how it demonstrates the concept]\n\n**Tips for Using These Flashcards:**\n- Review cards in both directions (seeing term→definition and definition→term)\n- Use spaced repetition: review difficult cards more frequently\n- Practice active recall: try to answer before flipping the card\n- Group related cards together for conceptual learning\n- Add your own examples to make content more memorable\n\nThese flashcards cover the foundational elements of the topic while encouraging deeper understanding beyond simple memorization.",
    
    "study plan for calculus": "**Personalized Study Plan for Calculus**\n\n**Week 1: Functions & Limits**\n- **Topics:**\n  - Review of prerequisite concepts (algebra, trigonometry, functions)  \n  - Intuitive understanding of limits\n  - Formal definition of limits\n  - One-sided limits and continuity\n- **Practice Focus:** Evaluating limits algebraically and graphically\n- **Resources:** Stewart Calculus Ch. 1-2, Khan Academy videos on limits\n\n**Week 2: Derivatives - Concepts**\n- **Topics:**\n  - Rate of change and the derivative concept\n  - Derivative as a function\n  - Differentiation rules: power rule, product rule, quotient rule\n  - Derivatives of trigonometric functions\n- **Practice Focus:** Finding derivatives using rules, interpreting derivatives graphically\n- **Resources:** Stewart Calculus Ch. 3.1-3.4, MIT OpenCourseWare derivatives lectures\n\n**Week 3: Derivatives - Applications**\n- **Topics:**\n  - Chain rule\n  - Implicit differentiation\n  - Related rates\n  - Linear approximations\n- **Practice Focus:** Applying chain rule, solving related rates problems\n- **Resources:** Stewart Calculus Ch. 3.5-3.10, Paul's Online Math Notes\n\n**Week 4: Applications of Derivatives**\n- **Topics:**\n  - Extreme values\n  - Mean Value Theorem\n  - Curve sketching\n  - Optimization problems\n- **Practice Focus:** Solving max/min problems, complete curve analysis\n- **Resources:** Stewart Calculus Ch. 4, Professor Leonard's YouTube videos\n\n**Week 5: Integrals - Concepts**\n- **Topics:**\n  - Antiderivatives and indefinite integrals\n  - Area problem and definite integrals\n  - Fundamental Theorem of Calculus\n  - Basic integration rules\n- **Practice Focus:** Computing basic integrals, applying FTC\n- **Resources:** Stewart Calculus Ch. 5.1-5.5, 3Blue1Brown Essence of Calculus\n\n**Week 6: Integration Techniques**\n- **Topics:**\n  - Substitution method\n  - Integration by parts\n  - Partial fractions\n  - Trigonometric integrals\n- **Practice Focus:** Selecting and applying integration techniques\n- **Resources:** Stewart Calculus Ch. 7, PatrickJMT integration videos\n\n**Week 7: Applications of Integration**\n- **Topics:**\n  - Area between curves\n  - Volumes of solids\n  - Arc length and surface area\n  - Physics applications (work, force, center of mass)\n- **Practice Focus:** Setting up and solving applied integration problems\n- **Resources:** Stewart Calculus Ch. 6, MIT OCW applications lectures\n\n**Week 8: Review & Advanced Topics Preview**\n- **Topics:**\n  - Comprehensive review\n  - Introduction to sequences and series\n  - Introduction to differential equations\n- **Practice Focus:** Mixed problem sets, previous exam problems\n- **Resources:** Compilation of practice exams, comprehensive review guide\n\n**Study Strategies:**\n- Allocate 1-2 hours daily for calculus study\n- Complete at least 5-10 practice problems per concept\n- Form study groups for difficult concepts\n- Create concept maps connecting different calculus topics\n- Use multiple resources to understand challenging topics\n- Explain concepts aloud to test understanding\n\nAdjust the pace as needed based on your progress. Focus more time on areas where you need additional practice.",
    
    "analyze my learning style": "Based on your study patterns and preferences, I've analyzed your learning style and have some personalized recommendations:\n\n**Your Learning Style Profile:**\n\n1. **Primary Mode**: You appear to be a predominantly visual-conceptual learner who benefits from seeing relationships between ideas through diagrams, charts, and conceptual frameworks.\n\n2. **Processing Style**: You show characteristics of an analytical learner who breaks down complex information into logical components and prefers to understand the underlying principles before proceeding.\n\n3. **Environmental Preferences**: Your optimal learning environment seems to involve moderate structure with some flexibility, and you likely benefit from both individual study time and collaborative discussion.\n\n4. **Cognitive Strengths**: Your strengths include conceptual thinking, pattern recognition, and the ability to connect new information to existing knowledge.\n\n**Recommended Study Approaches:**\n\n1. **Input Methods:**\n   - Begin with overviews/outlines before diving into details\n   - Utilize mind maps and concept diagrams to visualize relationships\n   - Supplement text with visual aids (charts, graphs, videos)\n   - Take structured notes with hierarchical organization\n\n2. **Processing Techniques:**\n   - Allow time for conceptual understanding before memorization\n   - Ask \"why\" and \"how\" questions to deepen understanding\n   - Explain concepts in your own words (teaching others works well for you)\n   - Connect new information to previously learned concepts\n\n3. **Environment Optimization:**\n   - Create a dedicated study space with minimal distractions\n   - Use visual cues in your environment (posters, sticky notes)\n   - Alternate between focused individual study and group discussion\n   - Schedule study sessions during your peak cognitive hours (which appear to be morning/afternoon)\n\n4. **Retention Strategies:**\n   - Create visual summaries for review\n   - Use spaced repetition with increasing intervals\n   - Develop your own examples and applications\n   - Test yourself with questions that require conceptual understanding\n\n**Areas for Growth:**\n\nWhile leveraging your strengths, consider developing these complementary approaches:\n\n1. Practice auditory learning by discussing concepts aloud or using audio recordings\n2. Incorporate more hands-on activities to strengthen kinesthetic learning pathways\n3. Develop more structured routines for topics that require memorization\n\nRemember that flexibility in approach leads to more robust learning. The most effective students adapt their strategies based on the specific material rather than applying the same method universally."
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find a matching response based on the prompt
  const promptLower = prompt.toLowerCase();
  
  // Try to find an exact match first
  for (const key in responses) {
    if (promptLower.includes(key)) {
      return responses[key];
    }
  }
  
  // If no exact match, try to find the most relevant response
  if (promptLower.includes("physics") || promptLower.includes("quantum")) {
    return "I notice you're asking about physics! Physics is the study of matter, energy, and their interactions. It seeks to understand the fundamental laws that govern our universe, from subatomic particles to galaxies.\n\nSome key branches include:\n- Classical mechanics (motion, forces)\n- Electromagnetism (electricity, magnetism, light)\n- Thermodynamics (heat, energy)\n- Quantum mechanics (subatomic behavior)\n- Relativity (space, time, gravity)\n\nWhat specific aspect of physics are you interested in learning more about?";
  }
  
  if (promptLower.includes("math") || promptLower.includes("calculus") || promptLower.includes("algebra")) {
    return "Mathematics is a vast field with many branches! Some key areas include:\n\n- Algebra: Studying mathematical symbols and rules for manipulating them\n- Geometry: Properties of shapes, sizes, and spaces\n- Calculus: Rates of change and accumulation\n- Statistics: Collecting, analyzing and interpreting data\n- Number Theory: Properties of numbers\n\nCould you tell me which specific area of mathematics you're interested in learning about?";
  }
  
  if (promptLower.includes("history") || promptLower.includes("war") || promptLower.includes("century")) {
    return "History helps us understand the past and how it shapes our present and future. It encompasses:\n\n- Political history: Governments, policies, and conflicts\n- Social history: How people lived and societies changed\n- Economic history: Production, trade, and resource distribution\n- Cultural history: Art, ideas, beliefs, and customs\n\nIs there a particular historical period, event, or aspect you'd like to explore further?";
  }
  
  if (promptLower.includes("study") || promptLower.includes("learn") || promptLower.includes("exam")) {
    return "Effective studying is personal and depends on your learning style, but some proven techniques include:\n\n1. Active recall: Test yourself instead of just re-reading\n2. Spaced repetition: Review material at increasing intervals\n3. Interleaving: Mix different subjects rather than blocking them\n4. Elaboration: Ask why and how things work, connect ideas\n5. Concrete examples: Apply concepts to real situations\n\nWould you like more specific study techniques for your particular situation?";
  }
  
  // Default fallback response
  return "I don't have specific information about that topic. Could you provide more details or ask another question? I can help with explanations across many academic subjects, create study plans, generate practice questions, analyze learning styles, or create flashcards for better retention.";
};

// Generate study plan based on subject
const generateStudyPlan = (subject: string): StudyPlan => {
  // In a real implementation, this would call an API to get a tailored study plan
  
  const topics: Topic[] = [];
  const resources: Resource[] = [];
  
  if (subject.toLowerCase().includes("physics") || subject.toLowerCase().includes("quantum")) {
    topics.push(
      { id: uuidv4(), name: "Quantum Mechanics", status: "not-started", estimatedTime: "2 hours" },
      { id: uuidv4(), name: "Thermodynamics", status: "not-started", estimatedTime: "3 hours" },
      { id: uuidv4(), name: "Electromagnetism", status: "not-started", estimatedTime: "4 hours" }
    );
    
    resources.push(
      { id: uuidv4(), title: "Introduction to Quantum Mechanics", type: "textbook", link: "#" },
      { id: uuidv4(), title: "Thermodynamics Lecture Notes", type: "notes", link: "#" },
      { id: uuidv4(), title: "Electromagnetism Practice Problems", type: "problems", link: "#" }
    );
  } else if (subject.toLowerCase().includes("math")) {
    topics.push(
      { id: uuidv4(), name: "Calculus", status: "not-started", estimatedTime: "3 hours" },
      { id: uuidv4(), name: "Linear Algebra", status: "not-started", estimatedTime: "4 hours" },
      { id: uuidv4(), name: "Probability Theory", status: "not-started", estimatedTime: "3 hours" }
    );
    
    resources.push(
      { id: uuidv4(), title: "Calculus: Early Transcendentals", type: "textbook", link: "#" },
      { id: uuidv4(), title: "Linear Algebra Practice", type: "problems", link: "#" },
      { id: uuidv4(), title: "Introduction to Probability", type: "video", link: "#" }
    );
  } else {
    // Default general study plan
    topics.push(
      { id: uuidv4(), name: "Topic Overview", status: "not-started", estimatedTime: "1 hour" },
      { id: uuidv4(), name: "Core Concepts", status: "not-started", estimatedTime: "3 hours" },
      { id: uuidv4(), name: "Advanced Applications", status: "not-started", estimatedTime: "2 hours" }
    );
    
    resources.push(
      { id: uuidv4(), title: `Introduction to ${subject}`, type: "article", link: "#" },
      { id: uuidv4(), title: `${subject} Practice Problems`, type: "problems", link: "#" },
      { id: uuidv4(), title: `Advanced ${subject} Concepts`, type: "video", link: "#" }
    );
  }
  
  return {
    id: uuidv4(),
    subject,
    topics,
    resources,
    createdAt: new Date().toISOString()
  };
};

export const AIAssistantService = {
  // Message Management
  getMessages: (): Message[] => {
    if (typeof window === "undefined") return [];
    
    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!storedMessages) return [];
    
    try {
      return JSON.parse(storedMessages);
    } catch (error) {
      console.error("Error parsing AI assistant messages:", error);
      return [];
    }
  },
  
  addMessage: (role: "user" | "assistant", content: string): Message => {
    const newMessage: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const messages = AIAssistantService.getMessages();
    messages.push(newMessage);
    
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    return newMessage;
  },
  
  clearMessages: (): void => {
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
  },
  
  // AI Response
  getAIResponse: async (prompt: string): Promise<Message> => {
    // Add user message
    AIAssistantService.addMessage("user", prompt);
    
    // Get AI response
    const response = await generateAIResponse(prompt);
    
    // Add AI response to chat
    return AIAssistantService.addMessage("assistant", response);
  },
  
  // Study Plans
  getStudyPlans: (): StudyPlan[] => {
    if (typeof window === "undefined") return [];
    
    const storedPlans = localStorage.getItem(STUDY_PLANS_STORAGE_KEY);
    if (!storedPlans) return [];
    
    try {
      return JSON.parse(storedPlans);
    } catch (error) {
      console.error("Error parsing study plans:", error);
      return [];
    }
  },
  
  addStudyPlan: (subject: string): StudyPlan => {
    const newPlan = generateStudyPlan(subject);
    
    const plans = AIAssistantService.getStudyPlans();
    plans.push(newPlan);
    
    localStorage.setItem(STUDY_PLANS_STORAGE_KEY, JSON.stringify(plans));
    return newPlan;
  },
  
  updateStudyPlan: (plan: StudyPlan): boolean => {
    const plans = AIAssistantService.getStudyPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    
    if (index === -1) return false;
    
    plans[index] = plan;
    localStorage.setItem(STUDY_PLANS_STORAGE_KEY, JSON.stringify(plans));
    return true;
  },
  
  deleteStudyPlan: (id: string): boolean => {
    const plans = AIAssistantService.getStudyPlans();
    const filteredPlans = plans.filter(p => p.id !== id);
    
    if (filteredPlans.length === plans.length) return false;
    
    localStorage.setItem(STUDY_PLANS_STORAGE_KEY, JSON.stringify(filteredPlans));
    return true;
  },
  
  updateTopicStatus: (planId: string, topicId: string, status: "not-started" | "in-progress" | "completed"): boolean => {
    const plans = AIAssistantService.getStudyPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    
    if (planIndex === -1) return false;
    
    const plan = plans[planIndex];
    const topicIndex = plan.topics.findIndex(t => t.id === topicId);
    
    if (topicIndex === -1) return false;
    
    plan.topics[topicIndex].status = status;
    plans[planIndex] = plan;
    
    localStorage.setItem(STUDY_PLANS_STORAGE_KEY, JSON.stringify(plans));
    return true;
  },
  
  // Saved Prompts
  getSavedPrompts: (): SavedPrompt[] => {
    if (typeof window === "undefined") return [];
    
    const storedPrompts = localStorage.getItem(SAVED_PROMPTS_STORAGE_KEY);
    if (!storedPrompts) return [];
    
    try {
      return JSON.parse(storedPrompts);
    } catch (error) {
      console.error("Error parsing saved prompts:", error);
      return [];
    }
  },
  
  savePrompt: (text: string): SavedPrompt => {
    const newPrompt: SavedPrompt = {
      id: uuidv4(),
      text,
      savedAt: new Date().toISOString()
    };
    
    const prompts = AIAssistantService.getSavedPrompts();
    prompts.push(newPrompt);
    
    localStorage.setItem(SAVED_PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    return newPrompt;
  },
  
  deleteSavedPrompt: (id: string): boolean => {
    const prompts = AIAssistantService.getSavedPrompts();
    const filteredPrompts = prompts.filter(p => p.id !== id);
    
    if (filteredPrompts.length === prompts.length) return false;
    
    localStorage.setItem(SAVED_PROMPTS_STORAGE_KEY, JSON.stringify(filteredPrompts));
    return true;
  },
  
  clearAllData: (): void => {
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    localStorage.removeItem(STUDY_PLANS_STORAGE_KEY);
    localStorage.removeItem(SAVED_PROMPTS_STORAGE_KEY);
  }
}; 