// src/components/TaskList.js
import React from 'react';
import useTaskData from '../hooks/useTaskData';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ projectId, userId }) => {
  const {
    tasks,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    updateTask,
    refreshData
  } = useTaskData({ projectId, userId }, 10);

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
    } catch (err) {
      // Handle error (show notification, etc.)
      console.error('Failed to update task:', err);
    }
  };

  if (loading) return <div className="task-list-loading">Loading tasks...</div>;
  if (error) return <div className="task-list-error">Error: {error}</div>;

  return (
    <div className="task-list-container">
      <h2>Tasks</h2>
      <div className="task-list-header">
        <button onClick={refreshData}>Refresh</button>
      </div>
      
      {tasks.length === 0 ? (
        <p className="task-list-empty">No tasks found.</p>
      ) : (
        <>
          <div className="task-list">
            {tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onUpdate={handleTaskUpdate}
              />
            ))}
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-button"
              onClick={prevPage} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button 
              className="pagination-button"
              onClick={nextPage} 
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;

// import React, { useEffect, useState } from 'react';
// import { fetchTasks, updateTask } from '../api/taskApi';
// import TaskItem from './TaskItem';
// import './TaskList.css';

                   

                                                             

                                                                                          

                                                                            

// const TaskList = ({ projectId, userId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  
                                                                  

//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchTasks({ projectId, userId });
//         setTasks(response.tasks);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
    
//     loadTasks();
//   }, [projectId, userId]);
  
                                                                     

//   const handleTaskUpdate = async (taskId, updatedData) => {
//     try {
//       await updateTask(taskId, updatedData);
                                      

//       const response = await fetchTasks({ projectId, userId });
//       setTasks(response.tasks);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
  
                                                                 

                                                    

//   const handleNextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
                                                                            

//     }
//   };
  
//   const handlePrevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
                                                                            

//     }
//   };
  
//   if (loading) return <div>Loading tasks...</div>;
//   if (error) return <div>Error loading tasks: {error}</div>;
  
//   return (
//     <div className="task-list-container">
//       <h2>Tasks</h2>
//       {tasks.length === 0 ? (
//         <p>No tasks found.</p>
//       ) : (
//         <>
//           <div className="task-list">
//             {tasks.map(task => (
//               <TaskItem 
//                 key={task.id} 
//                 task={task} 
//                 onUpdate={(updatedData) => handleTaskUpdate(task.id, updatedData)}
//               />
//             ))}
//           </div>
//           <div className="pagination-controls">
//             <button 
//               onClick={handlePrevPage} 
//               disabled={page === 1}
//             >
//               Previous
//             </button>
//             <span>Page {page} of {totalPages}</span>
//             <button 
//               onClick={handleNextPage} 
//               disabled={page === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
                   


// export default TaskList;