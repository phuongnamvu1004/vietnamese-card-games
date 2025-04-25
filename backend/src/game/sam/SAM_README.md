## Transactions Rules

Let the value per card be x.

- Each normal card: x
- Each two: 2x
- If there exists a four of a kind that is not played: Total 30x
- Burnt (no cards are played): Total 20x

**Examples:**

Example 1: Remaining cards with twos

`valuePerCard = 5`

`Cards = [♥3, ♠2, ♦2, ♣2]`

- Normal card (♥3): 5
- Each two (♠2, ♦2, ♣2): 2 × 5 = 10 each
- Total: 5 + 10 × 3 = 35

Example 2: Four of a kind

`valuePerCard = 10`

`Cards = [♠4, ♠4, ♠4, ♠4, ♥7, ♦9]`

- Four of a kind (♠4, ♠4, ♠4, ♠4): 30 × 10 = 300
- This case does not account for other normal cards if there has already been a four of a kind
- Total: 300

Example 3: Burnt

`valuePerCard = 8`

`Cards = [♥3, ♠5, ♦6, ♣7, ♥8, ♠9, ♦10, ♣J, ♥Q, ♠K]`

- Burnt (no cards are played): 20 × 8 = 160
- Total: 160

Example 4: Burnt + Twos

`valuePerCard = 2`

`Cards = [♥2, ♠2, ♦6, ♣7, ♥8, ♠9, ♦10, ♣J, ♥Q, ♠K]`

- Burnt (no cards are played): 20 × 2 = 40
- Each added two (♥2, ♠2): 2
- Total: 40 + 2 × 2 = 44
