function validateInput(course, ag, submissions) {
    // Check if assignment group belongs to the correct course
    if (ag.course_id !== course.id) {
      throw new Error("Invalid input: Assignment group does not belong to the specified course.");
    }

  }
  
  function isAssignmentDue(dueDate) {
    const currentDate = new Date();
    return currentDate > dueDate;
  }
  
  function calculateWeightedScore(score, pointsPossible) {
    if (pointsPossible === 0) {
      throw new Error("Invalid data: points_possible cannot be 0.");
    }
    return (score / pointsPossible) * 100;
  }

  function formatResult(learnerData) {
    const result = [];
    for (const learnerId in learnerData) {
      const avg = Math.floor(learnerData[learnerId].totalScore / learnerData[learnerId].totalWeight);
      const assignmentScores = learnerData[learnerId].assignmentScores;
  
      const formattedResult = {
        id: parseInt(learnerId),
        avg: avg.toFixed(3),
      };
  
      for (const assignmentId in assignmentScores) {
        formattedResult[assignmentId] = assignmentScores[assignmentId].toFixed(3);
      }
  
      result.push(formattedResult);
    }
  
    return result;
  }

function getLearnerData(course, ag, submissions) {
    // Validate input data
    validateInput(course, ag, submissions);
  
    // Create a dictionary to store assignment details for quick access
    const assignmentDetails = {};
    ag.assignments.forEach((assignment) => {
      assignmentDetails[assignment.id] = {
        pointsPossible: assignment.points_possible,
        dueDate: new Date(assignment.due_at),
      };
    });
  
    // Calculate learner data
    const learnerData = {};
    submissions.forEach((submission) => {
      const assignmentId = submission.assignment_id;
      const learnerId = submission.learner_id;
      const submissionScore = submission.submission.score;
      const pointsPossible = assignmentDetails[assignmentId].pointsPossible;
      const dueDate = assignmentDetails[assignmentId].dueDate;
  
      // Check if the assignment is not yet due
      if (isAssignmentDue(dueDate)) {
        const weightedScore = calculateWeightedScore(submissionScore, pointsPossible);
        updateLearnerData(learnerData, learnerId, assignmentId, weightedScore);
      }
    });
  
    // Format the result
    const result = formatResult(learnerData);
  
    return result;
  }
  

  
  function updateLearnerData(learnerData, learnerId, assignmentId, weightedScore) {
    if (!learnerData[learnerId]) {
      learnerData[learnerId] = { totalScore: 0, totalWeight: 0, assignmentScores: {} };
    }
  
    learnerData[learnerId].totalScore += weightedScore;
    learnerData[learnerId].totalWeight += 1;
    
    // Ensure each assignment's score is accumulated
    learnerData[learnerId].assignmentScores[assignmentId] =
      learnerData[learnerId].assignmentScores[assignmentId] || 0;
    learnerData[learnerId].assignmentScores[assignmentId] += weightedScore;
  }
  
  
  
  // Example usage
  const course = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const ag = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "2023-11-15",
        points_possible: 500
      }
    ]
  };
  
  const submissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
      },
      {
        learner_id: 132,
        assignment_id: 3,
        submission: {
          submitted_at: "2023-03-07",
          score: 140
        }
      }
  ];
  
  const result = getLearnerData(course, ag, submissions);
  console.log(result);
  