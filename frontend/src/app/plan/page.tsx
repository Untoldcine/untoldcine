import styles from "./page.module.css";
import { Plans } from "./plans.js";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Plans />
      </div>
    </main>
  );
}
