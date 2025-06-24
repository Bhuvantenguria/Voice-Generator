import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';

interface Episode {
  file: File;
  subtitles: File | null;
  number: number;
}

interface Character {
  name: string;
  trained: boolean;
}

export default function AnimeDubbing() {
  const [trainingEpisodes, setTrainingEpisodes] = useState<Episode[]>([]);
  const [targetEpisode, setTargetEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Handle training episode uploads
  const onTrainingDrop = useCallback((acceptedFiles: File[]) => {
    const newEpisodes = acceptedFiles.map((file, index) => ({
      file,
      subtitles: null,
      number: index + 1,
    }));
    setTrainingEpisodes([...trainingEpisodes, ...newEpisodes]);
  }, [trainingEpisodes]);

  // Handle target episode upload
  const onTargetDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setTargetEpisode({
        file: acceptedFiles[0],
        subtitles: null,
        number: trainingEpisodes.length + 1,
      });
    }
  }, [trainingEpisodes.length]);

  const { getRootProps: getTrainingProps, getInputProps: getTrainingInputProps } = useDropzone({
    onDrop: onTrainingDrop,
    accept: {
      'video/*': ['.mp4', '.mkv']
    },
    maxFiles: 4,
  });

  const { getRootProps: getTargetProps, getInputProps: getTargetInputProps } = useDropzone({
    onDrop: onTargetDrop,
    accept: {
      'video/*': ['.mp4', '.mkv']
    },
    maxFiles: 1,
  });

  // Handle subtitle uploads
  const handleSubtitleUpload = (episodeNumber: number, file: File) => {
    if (targetEpisode?.number === episodeNumber) {
      setTargetEpisode({ ...targetEpisode, subtitles: file });
    } else {
      setTrainingEpisodes(episodes =>
        episodes.map(ep =>
          ep.number === episodeNumber ? { ...ep, subtitles: file } : ep
        )
      );
    }
  };

  // Add character
  const addCharacter = () => {
    const name = prompt('Enter character name:');
    if (name) {
      setCharacters([...characters, { name, trained: false }]);
    }
  };

  // Start dubbing process
  const startDubbing = async () => {
    if (!validateInputs()) return;

    setIsProcessing(true);
    try {
      // Simulated processing with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(i);
        
        // Update progress message based on stage
        if (i === 30) {
          toast({ title: 'Training voice models...' });
        } else if (i === 60) {
          toast({ title: 'Processing target episode...' });
        } else if (i === 90) {
          toast({ title: 'Finalizing dubbing...' });
        }
      }

      toast({
        title: 'Success',
        description: 'Dubbing completed successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete dubbing process',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Validate inputs
  const validateInputs = () => {
    if (trainingEpisodes.length < 4) {
      toast({
        title: 'Error',
        description: 'Please upload 4 training episodes',
        variant: 'destructive',
      });
      return false;
    }

    if (!targetEpisode) {
      toast({
        title: 'Error',
        description: 'Please upload a target episode',
        variant: 'destructive',
      });
      return false;
    }

    if (!characters.length) {
      toast({
        title: 'Error',
        description: 'Please add at least one character',
        variant: 'destructive',
      });
      return false;
    }

    const allHaveSubtitles = trainingEpisodes.every(ep => ep.subtitles) &&
      targetEpisode.subtitles;
    if (!allHaveSubtitles) {
      toast({
        title: 'Error',
        description: 'Please upload subtitles for all episodes',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Training Episodes */}
      <div>
        <h3 className="text-lg font-medium mb-4">Training Episodes (4 required)</h3>
        <div
          {...getTrainingProps()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
        >
          <input {...getTrainingInputProps()} />
          <p>Drop training episodes here or click to select</p>
        </div>
        {trainingEpisodes.map((episode) => (
          <div key={episode.number} className="mt-2 flex items-center gap-4">
            <span>Episode {episode.number}</span>
            <span className="text-sm text-gray-500">{episode.file.name}</span>
            <Input
              type="file"
              accept=".srt,.ass"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSubtitleUpload(episode.number, file);
              }}
            />
            {episode.subtitles && (
              <span className="text-green-500">✓ Subtitles added</span>
            )}
          </div>
        ))}
      </div>

      {/* Target Episode */}
      <div>
        <h3 className="text-lg font-medium mb-4">Target Episode</h3>
        <div
          {...getTargetProps()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
        >
          <input {...getTargetInputProps()} />
          <p>Drop target episode here or click to select</p>
        </div>
        {targetEpisode && (
          <div className="mt-2 flex items-center gap-4">
            <span>Target Episode</span>
            <span className="text-sm text-gray-500">{targetEpisode.file.name}</span>
            <Input
              type="file"
              accept=".srt,.ass"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSubtitleUpload(targetEpisode.number, file);
              }}
            />
            {targetEpisode.subtitles && (
              <span className="text-green-500">✓ Subtitles added</span>
            )}
          </div>
        )}
      </div>

      {/* Characters */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Characters</h3>
          <Button onClick={addCharacter}>Add Character</Button>
        </div>
        {characters.map((character) => (
          <div key={character.name} className="flex items-center gap-4 mb-2">
            <span>{character.name}</span>
            {character.trained && (
              <span className="text-green-500">✓ Trained</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress & Action */}
      {isProcessing ? (
        <div className="space-y-4">
          <Progress value={progress} />
          <p className="text-center text-sm text-gray-500">
            Processing... {progress}% complete
          </p>
        </div>
      ) : (
        <Button
          className="w-full"
          onClick={startDubbing}
          disabled={!validateInputs()}
        >
          Start Dubbing Process
        </Button>
      )}
    </div>
  );
} 