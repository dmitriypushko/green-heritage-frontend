import type { Plant } from '../../../entities/plant/model/types';
import { PlantCard } from '../../../entities/plant/ui/PlantCard';
import styles from './PlantGrid.module.scss';

interface PlantGridProps {
  plants: Plant[];
}

export const PlantGrid = ({ plants }: PlantGridProps) => {
 
  
    return (
      <div className={styles.grid}>
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    );
  };