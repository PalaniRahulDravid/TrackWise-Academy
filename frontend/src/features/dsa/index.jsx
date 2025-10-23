import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import DsaLanding from "./DsaLanding";
import DsaSheet from "./DsaSheet";
import DsaQuestion from "./DsaQuestion";

export default function DsaFeature() {
  const { user } = useAuth();
  const [stage, setStage] = useState('');
  const [questionId, setQuestionId] = useState(null);

  if (!stage) return <DsaLanding user={user} onStageSelect={setStage} />;
  if (questionId) return <DsaQuestion questionId={questionId} onBack={() => setQuestionId(null)} />;
  return <DsaSheet stage={stage} onSelectQuestion={setQuestionId} />;
}
