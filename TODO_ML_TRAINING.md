# TODO ML: skills + resume together

- [ ] Update `src/utils/ai.js`:
  - pass user_skills into ML backend `/api/analyze` (text + skills + target_role)
  - persist `user_skills` into analyses row + backend storage save
- [ ] Update `ml_model/api_server.py`:
  - update `/api/analyze` to accept `skills`
  - update `/api/analyses` insert to store `user_skills`
  - update `/api/train` to train from `storage/analyses.json` (real examples)
- [ ] Update `ml_model/train_model.py`:
  - update `ResumeAnalyzer.predict(resume_text, user_skills, target_role)`
  - update feature extraction to include user_skills in technical_skills for scoring
- [ ] Run backend training + verify `/api/health` + `/api/analyze`
