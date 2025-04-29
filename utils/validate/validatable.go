package validate

type Rules map[string][]string

type RulesMap map[string]Rules

type Validatable interface {
	ValidationRules() Rules
}
