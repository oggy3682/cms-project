<template>
  <div class="post-creator">
    <!-- Header Section -->
    <div class="creator-header">
      <div class="logo" @click="$router.push('/dashboard')">blooog</div>
      <div class="header-actions">
        <button class="publish-btn" @click="publishPost" :disabled="publishing" v-if="showEditor">
          <span v-if="publishing">
            <svg class="icon spin" viewBox="0 0 24 24">
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
            Saving...
          </span>
          <span v-else>
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
            </svg>
            Publish
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="creator-content">
      <transition name="slide-fade" mode="out-in">
        <!-- First Page: Post Details -->
        <div v-if="!showEditor" class="post-details" key="form">
          <h1>{{ draftLoaded ? 'Continue Draft' : 'Create New Post' }}</h1>

          <div class="form-group">
            <label>Post Title</label>
            <input v-model="currentPost.title" placeholder="Your amazing post title..."
              :class="{ 'error-input': errors.title }" @input="errors.title = false">
            <span v-if="errors.title" class="error-text">Please enter a title</span>
          </div>

          <div class="form-buttons">
            <button class="cancel-btn" @click="cancel">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z" />
              </svg>
              Cancel
            </button>
            <button class="continue-btn" @click="validateAndContinue">
              Continue
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M12 4l-1.4 1.4L16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Second Page: Editor -->
        <div v-else class="editor-viewport" key="editor">
          <div class="editor-container">
            <div class="editor-header">
              <h2>{{ currentPost.title }}</h2>
              <div class="post-meta">
                <span class="last-saved" v-if="lastSavedTime">
                  Last saved: {{ lastSavedTime }}
                </span>
              </div>
            </div>

            <div class="content-editor">
              <!-- Horizontal Formatting Toolbar -->
              <div class="formatting-toolbar horizontal-toolbar">
                <!-- Font Style Group -->
                <div class="toolbar-group">
                  <button @click="formatText('bold')" :class="{ 'active': isFormatActive('bold') }" title="Bold">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                    </svg>
                  </button>
                  <button @click="formatText('italic')" :class="{ 'active': isFormatActive('italic') }" title="Italic">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                    </svg>
                  </button>
                  <button @click="formatText('underline')" :class="{ 'active': isFormatActive('underline') }"
                    title="Underline">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
                    </svg>
                  </button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- Font Size Group -->
                <div class="toolbar-group">
                  <select v-model="selectedFontSize" @change="applyFontSize" title="Font Size">
                    <option value="">Size</option>
                    <option v-for="size in fontSizes" :value="size" :key="size">{{ size }}px</option>
                  </select>
                </div>

                <div class="toolbar-divider"></div>

                <!-- Headings Group -->
                <div class="toolbar-group">
                  <select v-model="selectedHeading" @change="applyHeading" title="Heading">
                    <option value="">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                </div>

                <div class="toolbar-divider"></div>

                <!-- Lists Group -->
                <div class="toolbar-group">
                  <button @click="formatText('insertUnorderedList')" title="Bullet List">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                    </svg>
                  </button>
                  <button @click="formatText('insertOrderedList')" title="Numbered List">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                    </svg>
                  </button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- Insert Group -->
                <div class="toolbar-group">
                  <button @click="insertLink" title="Link">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                    </svg>
                  </button>
                  <button @click="insertImage" title="Image">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
                    </svg>
                  </button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- Undo/Redo Group -->
                <div class="toolbar-group">
                  <button @click="formatText('undo')" title="Undo">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                    </svg>
                  </button>
                  <button @click="formatText('redo')" title="Redo">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content Editable Div -->
              <div ref="editableContent" class="editable-content" contenteditable="true" @input="handleContentChange"
                @focus="saveSelection" @mouseup="saveSelection" @keyup="saveSelection" @paste="handlePaste"></div>
            </div>

            <div class="editor-buttons">
              <button class="back-btn" @click="showEditor = false">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Success Notification -->
    <transition name="fade-up">
      <div v-if="showSuccess" class="success-notice">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
        Post published successfully!
      </div>
    </transition>

    <!-- Auto-save Notification -->
    <transition name="fade-up">
      <div v-if="showAutoSave" class="autosave-notice">
        Draft auto-saved
      </div>
    </transition>

    <!-- Link Dialog -->
    <div v-if="showLinkDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Insert Link</h3>
        <input v-model="linkUrl" placeholder="Enter URL" ref="linkInput">
        <div class="dialog-buttons">
          <button @click="showLinkDialog = false">Cancel</button>
          <button @click="confirmLink">Insert</button>
        </div>
      </div>
    </div>

    <!-- Image Dialog -->
    <div v-if="showImageDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Insert Image</h3>
        <input v-model="imageUrl" placeholder="Enter image URL" ref="imageInput">
        <div class="dialog-buttons">
          <button @click="showImageDialog = false">Cancel</button>
          <button @click="confirmImage">Insert</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    // State management
    const showEditor = ref(false)
    const publishing = ref(false)
    const showSuccess = ref(false)
    const showAutoSave = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const draftLoaded = ref(false)
    const lastSavedTime = ref('')
    const editableContent = ref(null)
    const selectedHeading = ref('')
    const selectedFontSize = ref('')
    const showLinkDialog = ref(false)
    const linkUrl = ref('')
    const showImageDialog = ref(false)
    const imageUrl = ref('')
    const linkInput = ref(null)
    const imageInput = ref(null)
    let lastSelection = null

    // Font sizes for the editor
    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

    // Current post data
    const currentPost = ref({
      id: Date.now(),
      title: '',
      content: '',
      createdAt: new Date().toISOString()
    })

    // Validation errors
    const errors = ref({
      title: false,
      content: false
    })

    // Get CSRF token from cookies
    const getCookie = (name) => {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1]
      return cookieValue || ''
    }

    // Save current selection in the editor
    const saveSelection = () => {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        lastSelection = selection.getRangeAt(0)
      }
    }

    // Restore saved selection
    const restoreSelection = () => {
      if (!lastSelection) return
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(lastSelection)
    }

    // Check if a format is active
    const isFormatActive = (command) => {
      return document.queryCommandState(command)
    }

    // Format text using execCommand
    const formatText = (command, value = null) => {
      saveSelection()
      document.execCommand(command, false, value)
      restoreSelection()
      editableContent.value.focus()
    }

    // Apply font size
    const applyFontSize = () => {
      if (!selectedFontSize.value) return
      formatText('fontSize', 7)
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.style.fontSize = `${selectedFontSize.value}px`

        if (range.collapsed) {
          span.innerHTML = '&nbsp;'
          range.insertNode(span)
          const newRange = document.createRange()
          newRange.setStart(span, 0)
          newRange.setEnd(span, 0)
          selection.removeAllRanges()
          selection.addRange(newRange)
        } else {
          range.surroundContents(span)
        }
      }
      editableContent.value.focus()
    }

    // Apply heading style
    const applyHeading = () => {
      if (!selectedHeading.value) {
        formatText('formatBlock', '<p>')
      } else {
        formatText('formatBlock', `<${selectedHeading.value}>`)
      }
    }

    // Handle content changes
    const handleContentChange = () => {
      currentPost.value.content = editableContent.value.innerHTML
      saveDraft()
    }

    // Handle paste event
    const handlePaste = (e) => {
      e.preventDefault()
      const text = (e.clipboardData || window.clipboardData).getData('text/plain')
      document.execCommand('insertText', false, text)
    }

    // Insert link
    const insertLink = () => {
      saveSelection()
      showLinkDialog.value = true
      linkUrl.value = ''
      nextTick(() => {
        linkInput.value.focus()
      })
    }

    // Confirm link insertion
    const confirmLink = () => {
      if (linkUrl.value) {
        formatText('createLink', linkUrl.value)
      }
      showLinkDialog.value = false
      editableContent.value.focus()
    }

    // Insert image
    const insertImage = () => {
      saveSelection()
      showImageDialog.value = true
      imageUrl.value = ''
      nextTick(() => {
        imageInput.value.focus()
      })
    }

    // Confirm image insertion
    const confirmImage = () => {
      if (imageUrl.value) {
        const img = document.createElement('img')
        img.src = imageUrl.value
        img.alt = 'User uploaded image'
        img.style.maxWidth = '100%'

        if (lastSelection) {
          lastSelection.deleteContents()
          lastSelection.insertNode(img)
        } else {
          editableContent.value.appendChild(img)
        }
      }
      showImageDialog.value = false
      editableContent.value.focus()
    }

    // Load draft from localStorage
    const loadDraft = () => {
      const draft = localStorage.getItem('blog_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          currentPost.value = parsed
          draftLoaded.value = true

          if (showEditor.value && editableContent.value) {
            editableContent.value.innerHTML = currentPost.value.content || ''
          }
        } catch (e) {
          console.error('Draft load error:', e)
        }
      }
    }

    // Save current draft
    const saveDraft = () => {
      if (editableContent.value) {
        currentPost.value.content = editableContent.value.innerHTML
      }

      const draft = {
        ...currentPost.value
      }
      localStorage.setItem('blog_draft', JSON.stringify(draft))
      lastSavedTime.value = new Date().toLocaleTimeString()
      showAutoSaveNotice()
    }

    // Show auto-save notification
    const showAutoSaveNotice = () => {
      showAutoSave.value = true
      setTimeout(() => showAutoSave.value = false, 2000)
    }

    // Validate and continue to editor
    const validateAndContinue = () => {
      errors.value = {
        title: !currentPost.value.title.trim()
      }

      if (!errors.value.title) {
        showEditor.value = true
        nextTick(() => {
          if (editableContent.value) {
            editableContent.value.innerHTML = currentPost.value.content || ''
          }
        })
        saveDraft()
      }
    }

    // Enhanced publish post method
    const publishPost = async () => {
      if (editableContent.value) {
        currentPost.value.content = editableContent.value.innerHTML
      }

      errors.value.content = !currentPost.value.content.trim()
      if (Object.values(errors.value).some(Boolean)) {
        console.error('Validation failed:', errors.value)
        return
      }

      publishing.value = true
      showError.value = false
      errorMessage.value = ''

      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          throw new Error('Authentication required. Please login again.')
        }

        // Try both Token and Bearer prefixes
        let response = await tryPublishWithToken(token, 'Token')
        
        // If first attempt fails with 403, try with Bearer prefix
        if (response.status === 403) {
          response = await tryPublishWithToken(token, 'Bearer')
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || 'Failed to save post')
        }

        // Clear draft
        localStorage.removeItem('blog_draft')

        // Reset form
        currentPost.value = {
          id: Date.now(),
          title: '',
          content: '',
          createdAt: new Date().toISOString()
        }

        showSuccess.value = true
        setTimeout(() => router.push('/dashboard'), 2000)
      } catch (error) {
        console.error('Publish error:', error)
        errorMessage.value = handleAuthError(error)
        showError.value = true
        setTimeout(() => showError.value = false, 5000)
        
        // Clear token if it's invalid
        if (error.message.includes('token') || error.message.includes('authentication')) {
          localStorage.removeItem('access_token')
        }
      } finally {
        publishing.value = false
      }
    }

    // Helper function to try publishing with different token prefixes
    const tryPublishWithToken = async (token, prefix) => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${prefix} ${token}`,
        'X-CSRFToken': getCookie('csrftoken'),
      }

      return await fetch('http://127.0.0.1:8000/api/create-blog/', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          title: currentPost.value.title,
          content: currentPost.value.content
        })
      })
    }

    // Improved error handler
    const handleAuthError = (error) => {
      if (error.message.includes('token') || error.message.includes('authentication')) {
        return 'Session expired. Please login again.'
      }
      if (error.message.includes('403')) {
        return 'Permission denied. You may need to login again.'
      }
      return error.message || 'Failed to publish post. Please try again.'
    }

    // Cancel post creation
    const cancel = () => {
      if (currentPost.value.title || (editableContent.value && editableContent.value.textContent.trim())) {
        if (confirm('You have unsaved changes. Save as draft?')) {
          saveDraft()
        } else {
          localStorage.removeItem('blog_draft')
        }
      }
      router.push('/dashboard')
    }

    // Set up auto-save interval
    let draftInterval
    onMounted(() => {
      loadDraft()
      draftInterval = setInterval(saveDraft, 10000)
    })

    // Clean up interval
    onUnmounted(() => {
      clearInterval(draftInterval)
    })

    return {
      currentPost,
      errors,
      showEditor,
      publishing,
      showSuccess,
      showAutoSave,
      showError,
      errorMessage,
      draftLoaded,
      lastSavedTime,
      editableContent,
      selectedHeading,
      selectedFontSize,
      fontSizes,
      showLinkDialog,
      linkUrl,
      showImageDialog,
      imageUrl,
      linkInput,
      imageInput,
      validateAndContinue,
      publishPost,
      cancel,
      formatText,
      isFormatActive,
      applyHeading,
      applyFontSize,
      handleContentChange,
      handlePaste,
      saveSelection,
      insertLink,
      confirmLink,
      insertImage,
      confirmImage
    }
  }
}
</script>

<style scoped>
/* Horizontal Toolbar Styles */
.formatting-toolbar.horizontal-toolbar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #444;
  margin: 0 8px;
}

.formatting-toolbar button {
  padding: 6px 8px;
  background: transparent;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
  margin: 0 2px;
}

.formatting-toolbar button:hover {
  background-color: #333;
}

.formatting-toolbar button.active {
  background-color: #ff6600;
  color: white;
}

.formatting-toolbar select {
  background-color: #333;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 8px;
  height: 32px;
  min-width: 80px;
  margin: 0 4px;
}

/* Keep all other existing styles */
.editable-content {
  flex: 1;
  background-color: #2a2a2a;
  color: white;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
  overflow-y: auto;
  outline: none;
  min-height: 300px;
}

.editable-content:focus {
  box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.3);
}

.editable-content h1 {
  font-size: 2em;
  margin: 0.67em 0;
  color: white;
}

.editable-content h2 {
  font-size: 1.5em;
  margin: 0.75em 0;
  color: white;
}

.editable-content h3 {
  font-size: 1.17em;
  margin: 0.83em 0;
  color: white;
}

.editable-content ul,
.editable-content ol {
  padding-left: 40px;
  margin: 1em 0;
}

.editable-content ul {
  list-style-type: disc;
}

.editable-content ol {
  list-style-type: decimal;
}

.editable-content a {
  color: #ff6600;
  text-decoration: underline;
}

.editable-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

/* Dialog styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dialog h3 {
  margin-top: 0;
  color: white;
}

.dialog input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #2a2a2a;
  border: 1px solid #333;
  color: white;
  border-radius: 4px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.dialog-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-buttons button:first-child {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #333;
}

.dialog-buttons button:last-child {
  background-color: #ff6600;
  color: white;
  border: none;
}

/* Keep all other existing styles */
.autosave-notice {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
}

.last-saved {
  font-size: 0.8rem;
  color: #666;
  margin-left: 1rem;
}

.spin {
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.post-creator {
  min-height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

.creator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 32px;
  font-weight: 800;
  color: #ff6600;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  text-transform: lowercase;
  letter-spacing: 1px;
}

.logo:hover {
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  vertical-align: middle;
  margin-right: 8px;
}

button {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.publish-btn {
  background-color: #ff6600;
  color: white;
}

.publish-btn:hover:not(:disabled) {
  background-color: #e65c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.2);
}

.publish-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.creator-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 30px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

.post-details {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.post-details h1 {
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: 700;
  color: white;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #e0e0e0;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6600;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.2);
}

.error-input {
  border-color: #ff4757 !important;
}

.error-text {
  color: #ff4757;
  font-size: 14px;
  margin-top: 8px;
  display: block;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #333;
}

.cancel-btn:hover {
  background-color: #333;
}

.continue-btn {
  background-color: #ff6600;
  color: white;
}

.continue-btn:hover {
  background-color: #e65c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.2);
}

.editor-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
  overflow: hidden;
}

.editor-container {
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.editor-header {
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.editor-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: white;
}

.post-meta {
  display: flex;
  gap: 16px;
  color: #e0e0e0;
  font-size: 14px;
}

.editor-buttons {
  padding: 20px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: flex-end;
}

.success-notice {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e1e1e;
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  border: 1px solid #2ed573;
}

.success-notice .icon {
  fill: #2ed573;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 768px) {
  .creator-header {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .creator-content {
    padding: 0 16px;
  }

  .post-details {
    padding: 24px;
  }

  .form-buttons {
    flex-direction: column;
  }

  button {
    width: 100%;
    justify-content: center;
  }

  .editor-header {
    padding: 16px;
  }

  .editor-buttons {
    padding: 16px;
  }

  /* Mobile toolbar adjustments */
  .formatting-toolbar.horizontal-toolbar {
    padding: 4px 8px;
  }

  .toolbar-group {
    margin-right: 4px;
  }

  .formatting-toolbar button {
    min-width: 28px;
    height: 28px;
    padding: 4px 6px;
  }

  .formatting-toolbar select {
    height: 28px;
    min-width: 80px;
    padding: 2px 4px;
    font-size: 14px;
  }
}
</style>