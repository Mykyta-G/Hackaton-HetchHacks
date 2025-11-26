<template>
  <div class="settings-container">
    <header class="header">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <h2>Settings</h2>
    </header>

    <div class="settings-content">
      <!-- Theme Settings -->
      <div class="section">
        <h3 class="section-title">Theme</h3>
        <div class="theme-selector">
          <div 
            v-for="theme in themes" 
            :key="theme.id"
            class="theme-option"
            :class="{ active: selectedTheme === theme.id }"
            @click="selectedTheme = theme.id"
          >
            <div class="theme-preview" :style="{ background: theme.preview }"></div>
            <span class="theme-name">{{ theme.name }}</span>
          </div>
        </div>
      </div>

      <!-- Family Members Management -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Family Members</h3>
          <button class="add-button" @click="showAddMember = true">
            <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Member
          </button>
        </div>
        <div class="members-list">
          <div 
            v-for="member in familyMembers" 
            :key="member.id" 
            class="member-card"
          >
            <div class="member-avatar">
              <span class="member-initial">{{ getInitial(member.name) }}</span>
            </div>
            <div class="member-info">
              <div class="member-name-row">
                <span class="member-name">{{ member.name }}</span>
                <div class="member-role-badge" :class="getMemberRoleClass(member.role)" v-if="isMemberAdmin(member.role)">
                  <svg class="member-crown-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                  </svg>
                </div>
              </div>
              <span class="member-email">{{ member.email }}</span>
            </div>
            <div class="member-actions">
              <label class="toggle-switch">
                <input 
                  type="checkbox" 
                  :checked="isMemberAdmin(member.role)"
                  @change="toggleAdmin(member.id)"
                  :disabled="member.id === currentUserId"
                >
                <span class="toggle-slider"></span>
                <span class="toggle-label">Admin</span>
              </label>
              <button 
                class="remove-button" 
                @click="removeMember(member.id)"
                :disabled="member.id === currentUserId"
              >
                <svg class="remove-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div class="section">
        <h3 class="section-title">Notifications</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Push Notifications</span>
            <span class="setting-description">Receive push notifications for tasks and events</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.notifications.push">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Task Reminders</span>
            <span class="setting-description">Get reminded about upcoming tasks</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.notifications.tasks">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Event Notifications</span>
            <span class="setting-description">Notifications for calendar events</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.notifications.events">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Shopping List Updates</span>
            <span class="setting-description">Notify when items are added or checked off</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.notifications.shopping">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="section">
        <h3 class="section-title">Account</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Email</span>
            <span class="setting-description">{{ currentUser.email }}</span>
          </div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Password</span>
            <span class="setting-description">Last changed 30 days ago</span>
          </div>
          <button class="edit-button">Change</button>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Delete Account</span>
            <span class="setting-description">Permanently delete your account and all data</span>
          </div>
          <button class="delete-account-button">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMember" class="modal-overlay" @click="showAddMember = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add Family Member</h3>
          <button class="modal-close" @click="showAddMember = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label>Name</label>
            <input type="text" v-model="newMember.name" placeholder="Enter name">
          </div>
          <div class="input-group">
            <label>Email</label>
            <input type="email" v-model="newMember.email" placeholder="Enter email">
          </div>
          <div class="input-group">
            <label>Role</label>
            <select v-model="newMember.role">
              <option value="Member">Member</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-cancel" @click="showAddMember = false">Cancel</button>
          <button class="modal-confirm" @click="addMember">Add Member</button>
        </div>
      </div>
    </div>

    <Nav :currentView="currentView" @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script>
import Nav from '../components/nav.vue';

export default {
  name: 'SettingsView',
  components: {
    Nav,
  },
  props: {
    currentView: {
      type: String,
      default: 'SettingsView'
    }
  },
  emits: ['navigate'],
  data() {
    return {
      selectedTheme: 'default',
      themes: [
        { id: 'default', name: 'Default', preview: 'linear-gradient(135deg, #00a8e8 0%, #007ea7 100%)' },
        { id: 'dark', name: 'Dark', preview: 'linear-gradient(135deg, #00171f 0%, #003459 100%)' },
        { id: 'ocean', name: 'Ocean', preview: 'linear-gradient(135deg, #007ea7 0%, #003459 100%)' },
        { id: 'sunset', name: 'Sunset', preview: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' }
      ],
      showAddMember: false,
      newMember: {
        name: '',
        email: '',
        role: 'Member'
      },
      currentUserId: 1,
      currentUser: {
        email: 'john.doe@example.com'
      },
      familyMembers: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Administrator'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'Administrator'
        },
        {
          id: 3,
          name: 'Alice Doe',
          email: 'alice.doe@example.com',
          role: 'Member'
        },
        {
          id: 4,
          name: 'Bob Doe',
          email: 'bob.doe@example.com',
          role: 'Member'
        }
      ],
      settings: {
        notifications: {
          push: true,
          tasks: true,
          events: true,
          shopping: false
        },
        privacy: {
          profileVisible: true,
          activityStatus: true
        },
        preferences: {
          autoSync: true,
          aiSuggestions: true,
          soundEffects: false
        }
      }
    };
  },
  methods: {
    getInitial(name) {
      return name.charAt(0).toUpperCase();
    },
    getMemberRoleClass(role) {
      const roleLower = role.toLowerCase();
      if (roleLower.includes('admin')) return 'member-role-admin';
      return 'member-role-member';
    },
    isMemberAdmin(role) {
      return role.toLowerCase().includes('admin');
    },
    toggleAdmin(memberId) {
      const member = this.familyMembers.find(m => m.id === memberId);
      if (member) {
        member.role = member.role === 'Administrator' ? 'Member' : 'Administrator';
      }
    },
    removeMember(memberId) {
      this.familyMembers = this.familyMembers.filter(m => m.id !== memberId);
    },
    addMember() {
      if (this.newMember.name && this.newMember.email) {
        const newId = Math.max(...this.familyMembers.map(m => m.id)) + 1;
        this.familyMembers.push({
          id: newId,
          name: this.newMember.name,
          email: this.newMember.email,
          role: this.newMember.role
        });
        this.newMember = { name: '', email: '', role: 'Member' };
        this.showAddMember = false;
      }
    }
  }
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
  padding-bottom: 100px;
  max-width: 600px;
  margin: 0 auto;
  color: white;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.header-icon {
  width: 28px;
  height: 28px;
  color: white;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Section */
.section {
  background: var(--secondary-color);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Theme Selector */
.theme-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.theme-option {
  background: var(--tertiary-color);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
}

.theme-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.theme-option.active {
  border-color: #ffc107;
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.theme-name {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  display: block;
}

/* Add Button */
.add-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--tertiary-color);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.add-icon {
  width: 16px;
  height: 16px;
}

/* Members List */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-card {
  background: var(--tertiary-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

.member-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.member-name {
  font-size: 1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-email {
  font-size: 0.85rem;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-role-badge {
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-role-admin {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.member-crown-icon {
  width: 14px;
  height: 14px;
  color: #ffc107;
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-switch input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: background 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: transform 0.3s ease;
}

.toggle-switch input:checked + .toggle-slider {
  background: #4caf50;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-label {
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Remove Button */
.remove-button {
  padding: 8px;
  background: rgba(244, 67, 54, 0.2);
  border: none;
  border-radius: 8px;
  color: #f44336;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 36px;
  height: 36px;
}

.remove-button:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.3);
}

.remove-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-icon {
  width: 18px;
  height: 18px;
}

/* Setting Item */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 12px;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.setting-label {
  font-size: 1rem;
  font-weight: 500;
}

.setting-description {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Edit Button */
.edit-button {
  padding: 8px 16px;
  background: var(--tertiary-color);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.edit-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.delete-account-button {
  padding: 8px 16px;
  background: rgba(244, 67, 54, 0.2);
  border: none;
  border-radius: 8px;
  color: #f44336;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.delete-account-button:hover {
  background: rgba(244, 67, 54, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: var(--secondary-color);
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.modal-close:hover {
  opacity: 1;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 20px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  background: var(--tertiary-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--fresh-sky);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-cancel,
.modal-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.modal-cancel {
  background: var(--tertiary-color);
  color: white;
}

.modal-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-confirm {
  background: var(--fresh-sky);
  color: white;
}

.modal-confirm:hover {
  background: var(--cerulean);
}
</style>

