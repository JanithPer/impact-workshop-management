"use client"

import FileUpload from '@/components/blocks/file-upload'
import PageHeader from '@/components/blocks/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Save } from 'lucide-react'
import React, { useState } from 'react'
import { initialComments, assignedPeople } from './data'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DateTimePicker } from '@/components/blocks/date-time-picker'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

const TaskPage = () => {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [selectedMode, setSelectedMode] = useState('success')

  const handleAddComment = () => {
    if (newComment.trim() === '') return
    
    const newCommentObj = {
      id: comments.length + 1,
      text: newComment.trim(),
    }
    
    setComments([...comments, newCommentObj])
    setNewComment('')
  }

  const handleRemoveComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddComment()
    }
  }

  const handleModeChange = (value: string) => {
    setSelectedMode(value)
  }

  return (
    <div className='pb-4'>
      <PageHeader firstLinkName="Jobs" secondLinkName="Task Page" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Engine Diagnostics</h2>
        <div className="flex gap-2">

        <Select value={selectedMode} onValueChange={handleModeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Mode</SelectLabel>
              <SelectItem className='text-green-500' value="success">Success</SelectItem>
              <SelectItem className='text-red-500' value="danger">Danger</SelectItem>
              <SelectItem className='text-yellow-500' value="warning">Warning</SelectItem>
              <SelectItem className='text-blue-500' value="info">Info</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

          <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
            <Pencil />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full cursor-pointer">
            <Save />
          </Button>
          <Button className="cursor-pointer">
            Done
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[16px] text-muted-foreground">
          Perform a full diagnostic scan to identify issues with fuel injection and turbo systems.
        </p>
      </div>

      <div className="p-4">
        <DateTimePicker />
      </div>

      {assignedPeople.length > 0 && (
        <div className="flex px-4 items-center gap-1.5">
          {assignedPeople.map(person => (
            <Avatar key={person.id} className="h-10 w-10">
              <AvatarImage 
                src={person.avatar} 
                alt={person.name}
              />
            </Avatar>
          ))}
          <Button variant="secondary" size="icon" className="rounded-full cursor-pointer">
            <Plus />
          </Button>
        </div>
      )} 
    
      <div className="p-4">
      <div className="flex gap-2 pb-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment}>
          Add
        </Button>
      </div>
        {comments.map((comment) => (
          <div key={comment.id} className="flex justify-between mb-2">
            <p className="text-[16px] text-muted-foreground">{comment.text}</p>
            <span 
              className="cursor-pointer hover:text-red-500" 
              onClick={() => handleRemoveComment(comment.id)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>

      <FileUpload />
    </div>
  )
}

export default TaskPage