
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/lib/data/DataContext';
import { useI18n } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  Calendar, 
  Github, 
  MoreVertical, 
  Edit, 
  Trash,
  X 
} from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    updateProject, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask 
  } = useData();
  const { t } = useI18n();
  
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(task => task.project_id === projectId);
  
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectName, setProjectName] = useState(project?.name || '');
  const [projectDescription, setProjectDescription] = useState(project?.description || '');
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [dropdownOpenTask, setDropdownOpenTask] = useState<string | null>(null);
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="text-primary hover:underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }
  
  const handleSaveProject = async () => {
    if (!projectName.trim()) return;
    
    await updateProject({
      ...project,
      name: projectName,
      description: projectDescription,
    });
    
    setIsEditingProject(false);
  };
  
  const handleCancelEditProject = () => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setIsEditingProject(false);
  };
  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle.trim() || !taskDueDate) return;
    
    await addTask({
      title: taskTitle,
      project_id: projectId || '',
      due_date: new Date(taskDueDate).toISOString(),
      priority: taskPriority,
      status: 'not_started',
    });
    
    setTaskTitle('');
    setTaskDueDate('');
    setTaskPriority('medium');
    setIsAddingTask(false);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setDropdownOpenTask(null);
  };
  
  const handleEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDueDate(new Date(task.due_date).toISOString().split('T')[0]);
    setTaskPriority(task.priority);
    setDropdownOpenTask(null);
  };
  
  const handleUpdateTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await updateTask({
      ...task,
      title: taskTitle,
      due_date: new Date(taskDueDate).toISOString(),
      priority: taskPriority,
    });
    
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDueDate('');
    setTaskPriority('medium');
  };
  
  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDueDate('');
    setTaskPriority('medium');
  };
  
  const handleToggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.status === 'completed') {
      await updateTask({
        ...task,
        status: 'in_progress',
      });
    } else {
      await completeTask(taskId);
    }
  };
  
  const toggleTaskDropdown = (taskId: string) => {
    if (dropdownOpenTask === taskId) {
      setDropdownOpenTask(null);
    } else {
      setDropdownOpenTask(taskId);
    }
  };
  
  const getProgressPercentage = () => {
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const priorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('projects')}
      </button>
      
      {isEditingProject ? (
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                {t('projectName')}
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="project-description" className="block text-sm font-medium mb-1">
                {t('projectDescription')}
              </label>
              <textarea
                id="project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCancelEditProject}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <button
              onClick={() => setIsEditingProject(true)}
              className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              {t('edit')}
            </button>
          </div>
          
          <p className="text-muted-foreground mb-4">{project.description}</p>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>{t('progress')}</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t('tasks')}</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => {}}
              className="flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              <Github className="h-4 w-4 mr-2" />
              {t('syncWithGithub')}
            </button>
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('newTask')}
            </button>
          </div>
        </div>
        
        {isAddingTask && (
          <div className="bg-muted p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-3">{t('newTask')}</h3>
            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="task-title" className="block text-sm font-medium mb-1">
                    {t('taskName')}
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="task-due-date" className="block text-sm font-medium mb-1">
                    {t('dueDate')}
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="task-priority" className="block text-sm font-medium mb-1">
                    {t('priority')}
                  </label>
                  <select
                    id="task-priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t('createTask')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {projectTasks.length > 0 ? (
          <div className="space-y-3">
            {projectTasks.map((task) => (
              <div 
                key={task.id}
                className={`border border-border rounded-md p-4 ${
                  task.status === 'completed' ? 'bg-muted' : 'bg-card'
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-task-title" className="block text-sm font-medium mb-1">
                        {t('taskName')}
                      </label>
                      <input
                        id="edit-task-title"
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-task-due-date" className="block text-sm font-medium mb-1">
                        {t('dueDate')}
                      </label>
                      <input
                        id="edit-task-due-date"
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-task-priority" className="block text-sm font-medium mb-1">
                        {t('priority')}
                      </label>
                      <select
                        id="edit-task-priority"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="low">{t('low')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="high">{t('high')}</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={handleCancelEditTask}
                        className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        onClick={() => handleUpdateTask(task.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        {t('save')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className={`h-6 w-6 rounded-full border ${
                          task.status === 'completed'
                            ? 'bg-primary border-primary flex items-center justify-center'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </button>
                      
                      <div>
                        <h3 className={`font-medium ${
                          task.status === 'completed' ? 'text-muted-foreground line-through' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center text-sm mt-1">
                          <span className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(task.due_date)}
                          </span>
                          
                          <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${priorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                          
                          <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(task.status)}`}>
                            {task.status === 'not_started' ? t('notStarted') :
                             task.status === 'in_progress' ? t('inProgress') : t('completed')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => toggleTaskDropdown(task.id)}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {dropdownOpenTask === task.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-left"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-destructive text-left"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">{t('noTasks')}</h3>
            <p className="text-muted-foreground mb-4">Create your first task to get started</p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t('newTask')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
