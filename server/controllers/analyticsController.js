const { Task, User, Project, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getTeamPerformance = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const teams = await User.findAll({
      attributes: [
        'id',
        'username',
        [
          // Count assigned tasks within timeframe
          sequelize.literal(`(
            SELECT COUNT(DISTINCT Task.id)
            FROM Tasks AS Task
            WHERE Task.assigneeId = User.id
            AND Task.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
          )`),
          'assignedTasks'
        ],
        [
          // Count completed tasks
          sequelize.literal(`(
            SELECT COUNT(DISTINCT Task.id)
            FROM Tasks AS Task
            WHERE Task.assigneeId = User.id
            AND Task.status = 'completed'
            AND Task.completedAt IS NOT NULL
            AND Task.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
          )`),
          'completedTasks'
        ],
        [
          // Calculate work hours considering task complexity
          sequelize.literal(`(
            SELECT COALESCE(SUM(
              TIMESTAMPDIFF(HOUR, 
                GREATEST(Task.createdAt, '${startDate.toISOString()}'),
                LEAST(IFNULL(Task.completedAt, NOW()), '${endDate.toISOString()}')
              ) * (Task.complexity / 5.0) # Normalize complexity (1-10 scale) to a multiplier
            ), 0)
            FROM Tasks AS Task
            WHERE Task.assigneeId = User.id
            AND Task.createdAt <= '${endDate.toISOString()}'
            AND (Task.completedAt IS NULL OR Task.completedAt >= '${startDate.toISOString()}')
            AND Task.status != 'cancelled'
          )`),
          'totalWorkHours'
        ],
        [
          // Count work days excluding weekends
          sequelize.literal(`(
            SELECT COUNT(DISTINCT DATE(Task.createdAt))
            FROM Tasks AS Task
            WHERE Task.assigneeId = User.id
            AND Task.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
            AND DAYOFWEEK(Task.createdAt) NOT IN (1, 7) # Exclude weekends
          )`),
          'workDays'
        ]
      ],
      group: ['User.id', 'User.username'],
      raw: true
    });

    // Maintain the same response structure
    res.json({
      teams: teams.map(team => ({
        id: team.id,
        name: team.username,
        assignedTasks: parseInt(team.assignedTasks),
        completedTasks: parseInt(team.completedTasks),
        totalWorkHours: parseInt(team.totalWorkHours || 0),
        workDays: parseInt(team.workDays || 1),
        // Adding completion rate calculation as expected by frontend
        completionRate: parseInt(team.completedTasks) / parseInt(team.assignedTasks)
      })),
      timeframe: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: new Date()
      },
      // Adding completionRates array as expected by frontend
      completionRates: teams.map(team => ({
        teamId: team.id,
        teamName: team.username,
        completionRate: parseInt(team.completedTasks) / parseInt(team.assignedTasks)
      })),
      // Adding metrics for efficiency calculations
      metrics: {
        totalCompletedTasks: teams.reduce((sum, team) => sum + parseInt(team.completedTasks), 0),
        totalWorkHours: teams.reduce((sum, team) => sum + parseInt(team.totalWorkHours || 0), 0),
        averageTasksPerDay: teams.reduce((sum, team) => 
          sum + (parseInt(team.completedTasks) / parseInt(team.workDays || 1)), 0) / teams.length
      }
    });
  } catch (error) {
    console.error('Error fetching team performance data:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

exports.getTaskStatistics = async (req, res) => {
  try {
    // Get tasks by status
    const tasksByStatus = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date()
          ]
        }
      },
      group: ['status'],
      raw: true
    });

    // Get completed tasks with details
    const completedTasks = await Task.findAll({
      attributes: [
        'id',
        'createdAt',
        'completedAt',
        'priority',
        'complexity'
      ],
      where: {
        status: 'completed',
        completedAt: { [Op.not]: null },
        [Op.not]: { status: 'cancelled' }
      },
      raw: true
    });

    // Get tasks by priority
    const tasksByPriority = await Task.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        [Op.not]: { status: 'cancelled' },
        createdAt: {
          [Op.between]: [
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date()
          ]
        }
      },
      group: ['priority'],
      raw: true
    });

    const statusCounts = tasksByStatus.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count);
      return acc;
    }, {});

    const priorityCounts = tasksByPriority.reduce((acc, curr) => {
      acc[curr.priority] = parseInt(curr.count);
      return acc;
    }, {});

    res.json({
      statusBreakdown: statusCounts,
      priorityBreakdown: priorityCounts,
      completedTasks: completedTasks.map(task => ({
        ...task,
        completionTime: task.completedAt ? 
          Math.round((new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60)) : null
      })),
      totalTasks: Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
};




// const { Task, User, Project, sequelize } = require('../models');
// const { Op } = require('sequelize');

                   

   
                                                
                                                                      
   
// exports.getTeamPerformance = async (req, res) => {
//   try {
                                                                                 

                                                                      

//     const teams = await User.findAll({
//       attributes: [
//         'id',
//         'username',
//         [sequelize.fn('COUNT', sequelize.col('assignedTasks.id')), 'assignedTasks'],
//         [
                                                                      

                                                                             

//           sequelize.literal(`(
//             SELECT COUNT(*) 
//             FROM tasks 
//             WHERE tasks.assigneeId = User.id AND tasks.status = 'completed'
//           )`),
//           'completedTasks'
//         ],
//         [
                                                                                    

//           sequelize.literal(`(
//             SELECT SUM(TIMESTAMPDIFF(HOUR, tasks.createdAt, IFNULL(tasks.completedAt, NOW()))) 
//             FROM tasks 
//             WHERE tasks.assigneeId = User.id
//           )`),
//           'totalWorkHours'
//         ],
//         [
                                                                             

//           sequelize.literal(`(
//             SELECT COUNT(DISTINCT DATE(tasks.createdAt)) 
//             FROM tasks 
//             WHERE tasks.assigneeId = User.id
//           )`),
//           'workDays'
//         ]
//       ],
//       include: [{
//         model: Task,
//         as: 'assignedTasks',
//         attributes: [],                                      

//         required: false
//       }],
//       group: ['User.id'],
//       raw: true
//     });

                                                                         

                                             

//     res.json({
//       teams: teams.map(team => ({
//         id: team.id,
//         name: team.username,
//         assignedTasks: parseInt(team.assignedTasks),
//         completedTasks: parseInt(team.completedTasks),
//         totalWorkHours: parseInt(team.totalWorkHours || 0),
//         workDays: parseInt(team.workDays || 1)
//       })),
//       timeframe: {
//         start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),               

//         end: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching team performance data:', error);
//     res.status(500).json({ message: 'Error fetching analytics data' });
//   }
// };

// exports.getTaskStatistics = async (req, res) => {
//   try {
                                                                

                                                                           

//     const tasksByStatus = await Task.findAll({
//       attributes: [
//         'status',
//         [sequelize.fn('COUNT', sequelize.col('id')), 'count']
//       ],
//       group: ['status'],
//       raw: true
//     });
    
                                                                                      

//     const completedTasks = await Task.findAll({
//       attributes: ['id', 'createdAt', 'completedAt', 'priority'],
//       where: {
//         status: 'completed',
//         completedAt: { [Op.not]: null }
//       },
//       raw: true
//     });
    
                                                                                 

//     const tasksByPriority = await Task.findAll({
//       attributes: [
//         'priority',
//         [sequelize.fn('COUNT', sequelize.col('id')), 'count']
//       ],
//       group: ['priority'],
//       raw: true
//     });
    
                                                 

//     const statusCounts = tasksByStatus.reduce((acc, curr) => {
//       acc[curr.status] = parseInt(curr.count);
//       return acc;
//     }, {});
    
//     const priorityCounts = tasksByPriority.reduce((acc, curr) => {
//       acc[curr.priority] = parseInt(curr.count);
//       return acc;
//     }, {});
    
//     res.json({
//       statusBreakdown: statusCounts,
//       priorityBreakdown: priorityCounts,
//       completedTasks: completedTasks,
//       totalTasks: Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
//     });
//   } catch (error) {
//     console.error('Error fetching task statistics:', error);
//     res.status(500).json({ message: 'Error fetching task statistics' });
//   }
// };
                   
