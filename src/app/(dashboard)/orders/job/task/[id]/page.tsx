"use client"


import PageHeader from '@/components/blocks/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Save, Trash2 } from 'lucide-react' 
import React, { useState, useEffect, useCallback } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DateTimePicker } from '@/components/blocks/date-time-picker'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParams, useRouter } from 'next/navigation' 
import { api } from '@/lib/axios' 
import { Task, Person, Picture, Comment as TaskComment } from '@/types/task' 
import { toast } from 'sonner'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'; 
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { XIcon } from 'lucide-react'; // For remove icon



const TaskDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCommentText, setNewCommentText] = useState(''); 
  const [stagedNewComments, setStagedNewComments] = useState<string[]>([]);
  const [commentsToRemoveIndices, setCommentsToRemoveIndices] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableName, setEditableName] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [picturesToRemove, setPicturesToRemove] = useState<string[]>([]);

  // Updated state for user management
  const [allUsers, setAllUsers] = useState<Person[]>([]); // Use Person type
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [selectedUserIdsInModal, setSelectedUserIdsInModal] = useState<string[]>([]); 

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/tasks/${taskId}`);
      
      const fetchedTaskData = response.data.data;
      
       
      
      
      
      setTask(fetchedTaskData);
      setEditableName(fetchedTaskData.name);
      setEditableDescription(fetchedTaskData.description || '');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch task details');
      toast.error(err.response?.data?.message || 'Failed to fetch task details');
      console.error("Fetch task error:", err);
    }
    setIsLoading(false);
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Corrected API endpoint
        const response = await api.get('/users'); // Corrected path
        setAllUsers(response.data.data || []);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch users');
        console.error("Fetch all users error:", err);
      }
    };
    fetchAllUsers();
  }, []);

  // Comments to display, filtering out those marked for removal
  const existingCommentsForDisplay = task?.comments?.filter((_comment, index) => !commentsToRemoveIndices.includes(index)) || [];

  const handleSaveChanges = async () => {
    if (!task) return;
    
    const formData = new FormData();
    
    formData.append('name', editableName); 
    formData.append('description', editableDescription);

    formData.append('colorMode', task.colorMode);
    // Ensure assignedPeople contains the latest state including new assignments/removals
    // task.assignedPeople should be updated by handleConfirmAssignUsers and handleRemoveAssignedPerson directly
    if (task.assignedPeople) {
      formData.append('assignedPeople', JSON.stringify(task.assignedPeople.map(p => p._id)));
    }

    // Construct final comments array
    let finalComments: TaskComment[] = task.comments ? [...task.comments] : [];
    // Apply removals from existing comments
    // Sort indices in descending order to avoid shifting issues when splicing
    const sortedIndicesToRemove = [...commentsToRemoveIndices].sort((a, b) => b - a);
    sortedIndicesToRemove.forEach(index => {
      if (finalComments && index < finalComments.length) {
        finalComments.splice(index, 1);
      }
    });
    // Add staged new comments
    finalComments = [...finalComments, ...stagedNewComments];

    if (finalComments.length > 0 || (task.comments && task.comments.length > 0)) { 
      formData.append('comments', JSON.stringify(finalComments)); 
    }

    if (task.start) {
      formData.append('start', new Date(task.start).toISOString());
    }
    
    
    
    
    
    // }

    
    stagedFiles.forEach(file => {
      formData.append('pictures', file);
    });

    
    if (picturesToRemove.length > 0) {
      formData.append('picturesToRemove', JSON.stringify(picturesToRemove));
    }

    try {
      setIsLoading(true);
      const response = await api.patch(`/tasks/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTask(response.data.data);
      setStagedFiles([]); 
      setPicturesToRemove([]); 
      setStagedNewComments([]); 
      setCommentsToRemoveIndices([]); 
      toast.success('Task updated successfully!');
      fetchTask(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      console.error("Update task error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDone = async () => {
    if (!task) return;
    const newStatus = task.status === 'done' ? 'in-progress' : 'done';
    try {
      setIsLoading(true);
      
      const response = await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Task marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = () => { 
    if (newCommentText.trim() === '') return;
    const commentToAdd = newCommentText.trim();
    setStagedNewComments(prev => [...prev, commentToAdd]);
    setNewCommentText('');
    toast.info('Comment staged. Save changes to persist.');
  };

  const handleRemoveExistingComment = (commentIndex: number) => {
    if (!task || !task.comments || commentIndex < 0 || commentIndex >= task.comments.length) return;
    
    
    if (commentsToRemoveIndices.includes(commentIndex)) {
      setCommentsToRemoveIndices(prev => prev.filter(idx => idx !== commentIndex));
      toast.info('Comment un-marked for removal.');
    } else {
      setCommentsToRemoveIndices(prev => [...prev, commentIndex]);
      toast.info('Comment marked for removal. Save changes to persist.');
    }
  };

  const handleRemoveStagedComment = (stagedCommentIndex: number) => {
    setStagedNewComments(prev => prev.filter((_, index) => index !== stagedCommentIndex));
    toast.info('Staged comment removed.');
  };
  
  const handleUpdateNameDescription = async () => {
    if (!task) return;
    try {
      setIsLoading(true);
      // No need to call API here if name/description are part of the main save
      // This function can be removed if covered by handleSaveChanges
      // For now, let's assume it's for a separate quick edit feature if desired.
      // If name/description are always saved with handleSaveChanges, this specific update can be removed.
      // To keep it simple and ensure name/description are saved with other changes:
      // We rely on handleSaveChanges to send editableName and editableDescription.
      // This function might only update local state if not saving immediately.
      // For now, let's assume it updates the main task object locally for consistency before save.
      setTask(prev => prev ? { ...prev, name: editableName, description: editableDescription } : null);
      setIsEditModalOpen(false);
      toast.success('Task details staged for saving!'); // Changed from direct update to staging
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task details');
    } finally {
      setIsLoading(false);
    }
  };

  // User assignment handlers
  const handleOpenAssignUserModal = () => {
    if (!task || !task.assignedPeople) {
        setSelectedUserIdsInModal([]);
    } else {
        setSelectedUserIdsInModal(task.assignedPeople.map(p => p._id));
    }
    setIsAssignUserModalOpen(true);
  };

  const handleCloseAssignUserModal = () => {
    setIsAssignUserModalOpen(false);
  };

  const handleToggleUserSelectionInModal = (userId: string) => {
    setSelectedUserIdsInModal(prevSelectedIds =>
      prevSelectedIds.includes(userId)
        ? prevSelectedIds.filter(id => id !== userId)
        : [...prevSelectedIds, userId]
    );
  };

  const handleConfirmAssignUsers = () => {
    if (!task) return;
    const newAssignedPeople = allUsers.filter(user => selectedUserIdsInModal.includes(user._id));
    setTask(prevTask => prevTask ? { ...prevTask, assignedPeople: newAssignedPeople } : null);
    toast.info('Assigned users updated. Save changes to persist.');
    handleCloseAssignUserModal();
  };

  const handleRemoveAssignedPerson = (personId: string) => {
    if (!task || !task.assignedPeople) return;
    const updatedAssignedPeople = task.assignedPeople.filter(p => p._id !== personId);
    setTask(prevTask => prevTask ? { ...prevTask, assignedPeople: updatedAssignedPeople } : null);
    toast.info('User unassigned. Save changes to persist.');
  };


  if (isLoading && !task) return <div className="p-4">Loading task details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!task) return <div className="p-4">Task not found.</div>;

  const currentComments = task.comments ? [...task.comments] : [];
  const displayComments = currentComments
    .map((comment, index) => ({ text: comment, originalIndex: index, type: 'existing' as 'existing' | 'staged' }))
    .filter(comment => !commentsToRemoveIndices.includes(comment.originalIndex));
  
  const allDisplayComments = [
    ...displayComments,
    ...stagedNewComments.map(comment => ({ text: comment, type: 'staged' as 'existing' | 'staged' }))
  ];

  return (
    <div className='pb-20'> {/* Increased pb for better scroll with more content */}
      <PageHeader 
        firstLinkName={task.jobId ? "Job" : "Repair Order"} 
        firstLinkHref={task.jobId ? `/orders/job/${task.jobId}` : `/orders/repair-orders/${task.repairOrderId}`}
        secondLinkName="Task Details" 
      />

      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className={cn(
            "text-2xl font-semibold",
            task.status === 'done' && "line-through text-muted-foreground"
          )}>
            {task.name}
          </h2>
          <Button variant="outline" size="icon" className="rounded-full cursor-pointer h-7 w-7" onClick={() => {
            setEditableName(task.name);
            setEditableDescription(task.description || '');
            setIsEditModalOpen(true);
          }}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Select 
            value={task.colorMode}
            onValueChange={(value) => setTask(prev => prev ? { ...prev, colorMode: value as Task['colorMode'] } : null)}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color Mode</SelectLabel>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="danger">Danger</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="secondary" size="icon" className="rounded-full cursor-pointer h-9 w-9" onClick={handleSaveChanges} disabled={isLoading}>
            <Save className="h-5 w-5" />
          </Button>
          <Button onClick={handleToggleDone} disabled={isLoading} className={cn(task.status === 'done' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600')}>
            {task.status === 'done' ? 'Mark as In-Progress' : 'Mark as Done'}
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className={cn(
          "text-base text-muted-foreground",
          task.status === 'done' && "line-through"
        )}>
          {task.description || 'No description provided.'}
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DateTimePicker 
            value={task.start ? new Date(task.start) : undefined} 
            onChange={(date) => setTask(prev => prev ? { ...prev, start: date } : null)} 
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Assigned People</h3>
        {task.assignedPeople && task.assignedPeople.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {task.assignedPeople.map((person: Person) => (
              <div key={person._id} className="relative group">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={person.avatar?.url || '/default-avatar.png'} 
                    alt={person.name}
                  />
                </Avatar>
                <Button 
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAssignedPerson(person._id)}
                  disabled={isLoading}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-xs bg-black text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {person.name}
                </span>
              </div>
            ))}
            <Button variant="secondary" size="icon" className="rounded-full cursor-pointer h-10 w-10" onClick={handleOpenAssignUserModal} disabled={isLoading}>
              <Plus /> 
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">No one assigned yet.</p>
            <Button variant="secondary" size="icon" className="rounded-full cursor-pointer h-10 w-10" onClick={handleOpenAssignUserModal} disabled={isLoading}>
              <Plus /> 
            </Button>
          </div>
        )}
      </div> 
    
      {/* Comments Section */}
      <div className="p-4">
        <Label className="block mb-2">Comments</Label>
        <div className="flex gap-2 pb-2">
          <Input
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleAddComment} disabled={isLoading || newCommentText.trim() === ''}>
            Add
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {/* Display existing comments (not marked for removal) */}
          {existingCommentsForDisplay.map((comment, originalIndex) => {
            // We need the original index from task.comments to correctly mark for removal
            const actualIndexInTaskComments = task.comments?.findIndex(c => c === comment && !commentsToRemoveIndices.includes(task.comments!.indexOf(c))) ?? -1;
            if (actualIndexInTaskComments === -1 && !task.comments?.includes(comment)) { // Should not happen if logic is correct
                // Fallback or skip rendering if we can't find the original index reliably for some reason
                // This case implies the comment might have been removed and re-added, or complex state issue
                // For simplicity, we'll try to find the first occurrence if not already marked for removal
                const firstOccurrenceIndex = task.comments?.indexOf(comment);
                if (firstOccurrenceIndex !== undefined && firstOccurrenceIndex !== -1 && !commentsToRemoveIndices.includes(firstOccurrenceIndex)) {
                    
                } else {
                    return null; // Skip rendering if we can't reliably get an index
                }
            }
            const originalCommentIndex = task.comments ? task.comments.indexOf(comment, commentsToRemoveIndices.includes(task.comments.indexOf(comment)) ? task.comments.indexOf(comment) + 1 : 0) : -1;

            return (
              <div key={`existing-${originalCommentIndex}`} className={`flex justify-between items-center ${commentsToRemoveIndices.includes(originalCommentIndex) ? 'opacity-50 line-through' : ''}`}>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveExistingComment(originalCommentIndex)} disabled={isLoading}>
                  <Trash2 className={`h-4 w-4 ${commentsToRemoveIndices.includes(originalCommentIndex) ? 'text-yellow-500' : 'text-red-500'}`} />
                </Button>
              </div>
            );
          })}

          {/* Display staged new comments */}
          {stagedNewComments.map((comment, index) => (
            <div key={`staged-${index}`} className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveStagedComment(index)} disabled={isLoading}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pictures Section */}
      <div className="p-4">
        <Label className="block mb-2">Pictures</Label>
        {/* Display existing pictures */}
        {task.pictures && task.pictures.filter(pic => !picturesToRemove.includes(pic.publicId)).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {task.pictures.filter(pic => !picturesToRemove.includes(pic.publicId)).map((pic: Picture) => (
              <div key={pic.publicId} className="relative group">
                <img src={pic.url} alt={`Task image ${pic.publicId}`} className="rounded-md object-cover w-full h-32" />
                <Button 
                  variant="destructive"
                  size="icon" 
                  className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity p-1"
                  onClick={() => {
                    setPicturesToRemove(prev => [...prev, pic.publicId]);
                    // Optimistically update UI by filtering out, actual removal on save
                    // setTask(currentTask => currentTask ? ({...currentTask, pictures: currentTask.pictures.filter(p => p.publicId !== pic.publicId)}) : null);
                    toast.info(`Picture ${pic.publicId.substring(0,10)}... marked for removal. Save changes to confirm.`);
                  }}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {(!task.pictures || task.pictures.filter(pic => !picturesToRemove.includes(pic.publicId)).length === 0) && 
         (stagedFiles.length === 0 && <p className="text-sm text-muted-foreground mb-2">No pictures yet.</p>)}

        {/* Display staged new pictures for upload */}
        {stagedFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">New pictures to upload:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stagedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Staged ${file.name}`} 
                    className="rounded-md object-cover w-full h-32" 
                    onLoad={() => URL.revokeObjectURL(file.name)} // Clean up object URL
                  />
                   <Button 
                    variant="destructive"
                    size="icon" 
                    className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity p-1"
                    onClick={() => {
                      setStagedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Input 
          type="file"
          multiple
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              const newFilesArray = Array.from(e.target.files);
              setStagedFiles(prev => [...prev, ...newFilesArray]);
              toast.info(`${newFilesArray.length} picture(s) staged for upload. Save changes to persist.`);
              e.target.value = ''; // Reset file input
            }
          }}
          className="max-w-md mt-2"
          disabled={isLoading}
        />
        {/* <FileUpload /> */}
        {/* If you want to use your custom FileUpload component for display or a more complex UI, 
            ensure it either calls a prop like onFilesSelect or manages its own upload logic 
            and you adapt the TaskDetailsPage to work with it. 
            For now, a standard input is used for simplicity in getting File objects. */}
      </div>

      {/* Edit Name/Description Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskName" className="text-right">
                Name
              </Label>
              <Input 
                id="taskName" 
                value={editableName} 
                onChange={(e) => setEditableName(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskDescription" className="text-right">
                Description
              </Label>
              <Textarea 
                id="taskDescription" 
                value={editableDescription} 
                onChange={(e) => setEditableDescription(e.target.value)} 
                className="col-span-3" 
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            {/* This button now just updates local state, main save is via Save icon */}
            <Button type="button" onClick={handleUpdateNameDescription}>Update</Button> 
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User Modal */}
      <Dialog open={isAssignUserModalOpen} onOpenChange={setIsAssignUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Users</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid gap-4 py-4">
              {allUsers.length > 0 ? allUsers.map(user => (
                <div key={user._id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`user-${user._id}`}
                    checked={selectedUserIdsInModal.includes(user._id)}
                    onCheckedChange={() => handleToggleUserSelectionInModal(user._id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar?.url || undefined} alt={user.name} />
                    {/* Fallback can be added here */}
                  </Avatar>
                  <Label htmlFor={`user-${user._id}`} className="flex flex-col">
                    <span>{user.name}</span>
                    {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                  </Label>
                </div>
              )) : <p>No users available or failed to load users.</p>}
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmAssignUsers}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TaskDetailsPage;