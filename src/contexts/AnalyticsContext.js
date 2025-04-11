// src/contexts/AnalyticsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [teamResponse, taskResponse] = await Promise.all([
          axios.get('/api/analytics/team-performance'),
          axios.get('/api/analytics/task-statistics')
        ]);
        
        const teamData = teamResponse.data;
        const processedTeamData = {
          ...teamData,
          completionRates: teamData.teams.map(team => {
            const totalActiveTasks = team.assignedTasks - 
              (taskResponse.data.statusBreakdown.cancelled || 0);
            return {
              teamId: team.id,
              teamName: team.name,
              completionRate: totalActiveTasks > 0 ? 
                team.completedTasks / totalActiveTasks : 0
            };
          })
        };
        
        const taskData = taskResponse.data;
        const processedTaskData = {
          ...taskData,
          avgCompletionTime: calculateAverageCompletionTime(taskData.completedTasks)
        };
        
        setTeamPerformance(processedTeamData);
        setTaskStats(processedTaskData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const calculateAverageCompletionTime = (completedTasks) => {
    const validTasks = completedTasks.filter(task => 
      task.completedAt && task.createdAt
    );

    if (validTasks.length === 0) return 0;

    const totalTime = validTasks.reduce((sum, task) => {
      const completionTime = new Date(task.completedAt) - new Date(task.createdAt);
      return sum + completionTime;
    }, 0);

    return totalTime / validTasks.length;
  };
  
  const calculateTeamEfficiency = (teamId) => {
    if (!teamPerformance || !taskStats) return 0;
    
    const team = teamPerformance.teams.find(t => t.id === teamId);
    if (!team) return 0;
    
    const weightedTasks = taskStats.completedTasks
      .filter(task => task.assigneeId === teamId)
      .reduce((sum, task) => {
        const priorityWeight = {
          low: 1,
          medium: 1.5,
          high: 2,
          urgent: 3
        }[task.priority] || 1;
        
        return sum + (task.complexity * priorityWeight);
      }, 0);
    
    return weightedTasks / (team.totalWorkHours || 1);
  };
  
  const calculateProjection = (teamId, targetTasks) => {
    if (!teamPerformance) return 0;
    
    const team = teamPerformance.teams.find(t => t.id === teamId);
    if (!team || team.workDays === 0) return 0;
    
    const averageComplexity = taskStats.completedTasks
      .filter(task => task.assigneeId === teamId)
      .reduce((sum, task) => sum + task.complexity, 0) / team.completedTasks;
    
    const adjustedTasksPerDay = (team.completedTasks / team.workDays) / 
      (averageComplexity || 1);
    
    return targetTasks / adjustedTasksPerDay;
  };
  
  const value = {
    teamPerformance,
    taskStats,
    loading,
    error,
    calculateTeamEfficiency,
    calculateProjection
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;


// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

                   

                    

// const AnalyticsContext = createContext();

                                                  

// export const AnalyticsProvider = ({ children }) => {
//   const [teamPerformance, setTeamPerformance] = useState(null);
//   const [taskStats, setTaskStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

                        

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const [teamResponse, taskResponse] = await Promise.all([
//           axios.get('/api/analytics/team-performance'),
//           axios.get('/api/analytics/task-statistics')
//         ]);
        
                                                              

                                                              

//         const teamData = teamResponse.data;
//         const processedTeamData = {
//           ...teamData,
                                                                              

                                                                   

//           completionRates: teamData.teams.map(team => ({
//             teamId: team.id,
//             teamName: team.name,
                                                                          

//             completionRate: team.completedTasks / team.assignedTasks
//           }))
//         };
        
                                                                   

//         const taskData = taskResponse.data;
//         const processedTaskData = {
//           ...taskData,
                                                                                         

                                    

//           avgCompletionTime: taskData.completedTasks.reduce(
//             (sum, task) => sum + (task.completedAt - task.createdAt),
//             0
//           ) / taskData.completedTasks.length
//         };
        
//         setTeamPerformance(processedTeamData);
//         setTaskStats(processedTaskData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching analytics data:', err);
//         setError('Failed to load analytics data');
//         setLoading(false);
//       }
//     };
    
//     fetchAnalytics();
//   }, []);
  
                                                              

//   const calculateTeamEfficiency = (teamId) => {
//     if (!teamPerformance) return 0;
    
//     const team = teamPerformance.teams.find(t => t.id === teamId);
//     if (!team) return 0;
    
                                                                             

                                                                           

//     return team.completedTasks / (team.totalWorkHours || 1);
//   };
  
                                                            

//   const calculateProjection = (teamId, targetTasks) => {
//     if (!teamPerformance) return 0;
    
//     const team = teamPerformance.teams.find(t => t.id === teamId);
//     if (!team || team.completedTasks === 0) return 0;
    
                                                                        

                                                      

//     const tasksPerDay = team.completedTasks / team.workDays;
                                                     

//     return targetTasks / tasksPerDay;
//   };
  
//   const value = {
//     teamPerformance,
//     taskStats,
//     loading,
//     error,
//     calculateTeamEfficiency,
//     calculateProjection
//   };
  
//   return (
//     <AnalyticsContext.Provider value={value}>
//       {children}
//     </AnalyticsContext.Provider>
//   );
// };

                                

// export const useAnalytics = () => {
//   const context = useContext(AnalyticsContext);
//   if (!context) {
//     throw new Error('useAnalytics must be used within an AnalyticsProvider');
//   }
//   return context;
// };
                   
