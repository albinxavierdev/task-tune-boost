import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/lib/data/DataContext';
import { useI18n } from '@/lib/i18n';
import { Plus, Folders, MoreVertical, Edit, Trash, X } from 'lucide-react';

const ProjectsList: React.FC = () => {
  const { projects, tasks, addProject, deleteProject } = useData();
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  const openModal = () => {
    setProjectName('');
    setProjectDescription('');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const toggleDropdown = (projectId: string) => {
    if (dropdownOpen === projectId) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(projectId);
    }
  };
  
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) return;
    
    await addProject({
      name: projectName,
      description: projectDescription,
    });
    
    closeModal();
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      setDropdownOpen(null);
    }
  };
  
  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };
  
  const getTaskCount = (projectId: string) => {
    return tasks.filter(task => task.project_id === projectId).length;
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('myProjects')}</h1>
        <button
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('newProject')}
        </button>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-card border border-border rounded-lg p-5 shadow-sm relative"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => toggleDropdown(project.id)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                {dropdownOpen === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        navigate(`/projects/${project.id}`);
                        setDropdownOpen(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-left"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-destructive text-left"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      {t('delete')}
                    </button>
                  </div>
                )}
              </div>
              
              <div 
                className="mb-3 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="h-12 w-12 rounded-full bg-primary-foreground flex items-center justify-center mb-3">
                  <Folders className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{t('progress')}</span>
                  <span>{getProjectProgress(project.id)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${getProjectProgress(project.id)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 text-sm">
                <span className="text-muted-foreground">{getTaskCount(project.id)} {t('tasks')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Folders className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">{t('noProjects')}</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            {t('noProjects')}
          </p>
          <button
            onClick={openModal}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('createProject')}
          </button>
        </div>
      )}
      
      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-semibold mb-4">{t('newProject')}</h3>
            
            <form onSubmit={handleCreateProject}>
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
                    required
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
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t('createProject')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
