// src/hooks/useTaskData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTasks, updateTask as apiUpdateTask } from '../api/taskApi';

const CACHE_PREFIX = 'task_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const useTaskData = (filters = {}, pageSize = 10) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cache = useRef(new Map());

  const getCacheKey = (page) => {
    return `${CACHE_PREFIX}${JSON.stringify(filters)}_${page}_${pageSize}`;
  };

  const getFromCache = useCallback((page) => {
    const key = getCacheKey(page);
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
      localStorage.removeItem(key);
    }
    return null;
  }, [filters, pageSize]);

  const setCache = useCallback((page, data) => {
    const key = getCacheKey(page);
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    cache.current.set(page, data);
  }, [filters, pageSize]);

  const loadTasks = useCallback(async (currentPage = 1) => {
    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = getFromCache(currentPage);
      if (cachedData) {
        setTasks(cachedData.tasks);
        setTotalPages(cachedData.totalPages);
        setLoading(false);
        return;
      }

      const response = await fetchTasks({
        ...filters,
        page: currentPage,
        pageSize
      });

      const data = {
        tasks: response.tasks,
        totalPages: Math.ceil(response.total / pageSize)
      };

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setCache(currentPage, data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [filters, pageSize, getFromCache, setCache]);

  useEffect(() => {
    loadTasks(page);
  }, [page, loadTasks]);

  const updateTask = async (taskId, updatedData) => {
    try {
      const updatedTask = await apiUpdateTask(taskId, updatedData);
      
      // Update local state
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );

      // Update cache
      const cachedData = getFromCache(page);
      if (cachedData) {
        cachedData.tasks = cachedData.tasks.map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        );
        setCache(page, cachedData);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const refreshData = () => {
    loadTasks(page);
  };

  return {
    tasks,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    updateTask,
    refreshData
  };
};

export default useTaskData;

// import { useState, useEffect, useCallback } from 'react';
// import { fetchTasks } from '../api/taskApi';

                   

   
                                                     
                                            
                                                  
                                   
                                                 
   
// const useTaskData = (filters = {}, pageSize = 10) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  
                                                       

//   const loadTasks = useCallback(async (currentPage = 1) => {
//     try {
//       setLoading(true);
                                                         

//       const response = await fetchTasks({
//         ...filters,
//         page: currentPage,
//         pageSize
//       });
      
//       setTasks(response.tasks);
//       setTotalPages(Math.ceil(response.total / pageSize));
//       setLoading(false);
      
                                                          

//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   }, [filters, pageSize]);
  
                                                                

//   useEffect(() => {
//     loadTasks(page);
                                                  

//   }, [page, loadTasks]);
  
                                                               

//   const updateTask = async (taskId, updatedData) => {
//     try {
//       await updateTask(taskId, updatedData);
                                                                                     

//       await loadTasks(page);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
  
//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };
  
//   const prevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };
  
//   return {
//     tasks,
//     loading,
//     error,
//     page,
//     totalPages,
//     nextPage,
//     prevPage,
//     updateTask,
                                            

//   };
// };
                   


// export default useTaskData;