import { LoadingScreen } from "@/components/common";
import { QuizStartScreen } from "@/components/quiz/QuizStartScreen";
import { QuizResultScreen } from "@/components/quiz/QuizResultScreen";
import { QuizPlayScreen } from "@/components/quiz/QuizPlayScreen";
import { usePokemonList } from "@/hooks/usePokemonList";
import { useQuiz } from "@/hooks/useQuiz";

export function QuizPage() {
  const { pokemon: allPokemon, loading } = usePokemonList();
  const quiz = useQuiz(allPokemon);

  if (loading) return <LoadingScreen message="퀴즈 준비중..." />;

  if (quiz.phase === "ready" || !quiz.session || !quiz.currentQuestion) {
    return <QuizStartScreen totalPokemon={allPokemon.length} onStart={quiz.startQuiz} />;
  }

  if (quiz.phase === "finished") {
    return (
      <QuizResultScreen
        score={quiz.score}
        maxCombo={quiz.maxCombo}
        totalQuestions={quiz.totalQuestions}
        onRestart={quiz.resetQuiz}
      />
    );
  }

  return (
    <QuizPlayScreen
      session={quiz.session}
      question={quiz.currentQuestion}
      questionIndex={quiz.questionIndex}
      totalQuestions={quiz.totalQuestions}
      phase={quiz.phase}
      score={quiz.score}
      combo={quiz.combo}
      timeLeft={quiz.timeLeft}
      timeLimitSec={quiz.timeLimitSec}
      selectedAnswer={quiz.selectedAnswer}
      onSilhouetteAnswer={quiz.handleSilhouetteAnswer}
      onTypeAnswer={quiz.handleTypeAnswer}
      onGenerationAnswer={quiz.handleGenerationAnswer}
    />
  );
}
