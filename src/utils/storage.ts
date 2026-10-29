import { UserProfileState } from '../types';

const STORAGE_KEY = 'richfield_devquest_v2_profile';

export function loadStoredProfile(defaultProfile: UserProfileState): UserProfileState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile,
      ...parsed
    };
  } catch (err) {
    console.warn('Failed to load profile from localStorage:', err);
    return defaultProfile;
  }
}

export function saveStoredProfile(profile: UserProfileState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile to localStorage:', err);
  }
}

export function exportProfileToJson(profile: UserProfileState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `richfield_devquest_${profile.studentId || 'backup'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProfileFromJson(file: File, onSuccess: (profile: UserProfileState) => void, onError: (msg: string) => void): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const parsed = JSON.parse(text);
      if (!parsed.programme || !parsed.totalPoints) {
        throw new Error('Invalid DevQuest profile file format.');
      }
      saveStoredProfile(parsed);
      onSuccess(parsed);
    } catch (err: any) {
      onError(err.message || 'Failed to parse JSON backup file.');
    }
  };
  reader.onerror = () => onError('File reading failed.');
  reader.readAsText(file);
}
