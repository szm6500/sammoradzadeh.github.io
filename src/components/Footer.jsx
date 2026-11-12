import profile from "../data/profile.json";
import Icon from "./Icon";
import { scrollBehavior } from "../hooks/useNavigation";

export default function Footer({ activeTab }) {
  function backToTop() {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    document.getElementById(`tab-${activeTab}`)?.focus({ preventScroll: true });
  }
  return (
    <footer className="main-footer">
      <span suppressHydrationWarning>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <button className="back-top" onClick={backToTop}>
        Back to top
        <Icon name="arrow-up" />
      </button>
    </footer>
  );
}
