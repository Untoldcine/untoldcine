import styles from './plan-toggle.module.css'

const PlanToggle = ({ isAnnual, setIsAnnual }) => {
  const handleChange = (e) => {
      console.log('Toggle isAnnual:', e.target.checked); 
      setIsAnnual(e.target.checked);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={isAnnual}
        onChange={handleChange}
      />
      <span className={styles.slider}></span>
    </label>
  );
};


export default PlanToggle;
