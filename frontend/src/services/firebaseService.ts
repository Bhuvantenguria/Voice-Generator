import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export interface AnimeProject {
  id?: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  trainingEpisodes: {
    number: number;
    videoUrl: string;
    subtitlesUrl: string;
  }[];
  targetEpisode: {
    videoUrl: string;
    subtitlesUrl: string;
  };
  characters: {
    name: string;
    voiceModel: {
      trained: boolean;
      progress: number;
    };
  }[];
  progress: number;
  dubbedVideoUrl?: string;
}

export class FirebaseService {
  // Upload video file to Firebase Storage
  async uploadVideo(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, `videos/${path}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // Upload subtitle file to Firebase Storage
  async uploadSubtitles(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, `subtitles/${path}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // Create new anime project
  async createProject(project: Omit<AnimeProject, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'animeProjects'), {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  // Update project status and progress
  async updateProjectStatus(
    projectId: string,
    status: AnimeProject['status'],
    progress: number
  ): Promise<void> {
    const projectRef = doc(db, 'animeProjects', projectId);
    await updateDoc(projectRef, {
      status,
      progress,
      updatedAt: new Date(),
    });
  }

  // Get project details
  async getProject(projectId: string): Promise<AnimeProject | null> {
    const projectRef = doc(db, 'animeProjects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) return null;
    
    return {
      id: projectSnap.id,
      ...projectSnap.data(),
    } as AnimeProject;
  }

  // Upload all episode files and create project
  async uploadProjectFiles(
    title: string,
    trainingEpisodes: { video: File; subtitles: File; number: number }[],
    targetEpisode: { video: File; subtitles: File },
    characters: string[]
  ): Promise<string> {
    try {
      // Upload training episodes
      const uploadedTrainingEpisodes = await Promise.all(
        trainingEpisodes.map(async (episode) => {
          const videoUrl = await this.uploadVideo(
            episode.video,
            `training/${episode.number}/${episode.video.name}`
          );
          const subtitlesUrl = await this.uploadSubtitles(
            episode.subtitles,
            `training/${episode.number}/${episode.subtitles.name}`
          );
          return {
            number: episode.number,
            videoUrl,
            subtitlesUrl,
          };
        })
      );

      // Upload target episode
      const targetVideoUrl = await this.uploadVideo(
        targetEpisode.video,
        `target/${targetEpisode.video.name}`
      );
      const targetSubtitlesUrl = await this.uploadSubtitles(
        targetEpisode.subtitles,
        `target/${targetEpisode.subtitles.name}`
      );

      // Create project in Firestore
      const project: Omit<AnimeProject, 'id'> = {
        title,
        status: 'pending',
        trainingEpisodes: uploadedTrainingEpisodes,
        targetEpisode: {
          videoUrl: targetVideoUrl,
          subtitlesUrl: targetSubtitlesUrl,
        },
        characters: characters.map(name => ({
          name,
          voiceModel: {
            trained: false,
            progress: 0,
          },
        })),
        progress: 0,
      };

      return this.createProject(project);
    } catch (error) {
      console.error('Error uploading project files:', error);
      throw error;
    }
  }
} 