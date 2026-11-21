# SALTFINE Training & Validation Dataset

This directory is ready for sea salt optical inspection images.

### Folder Structure:
- `train/pure_salt/` -> Clean white salt crystal photos
- `train/impurities/` -> Foreign matter photos (dirt, clay, sand specks, organic debris)
- `val/pure_salt/` -> Validation clean salt photos
- `val/impurities/` -> Validation foreign matter photos

### Training the Impurity Detector:
```bash
py ml_service/train_impurity_detector.py
```
Outputs the trained model to `ml_service/models/salt_impurity_rf.joblib`.
