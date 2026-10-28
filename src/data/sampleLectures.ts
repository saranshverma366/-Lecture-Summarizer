export interface SampleLecture {
  id: string;
  title: string;
  subject: string;
  badge: string;
  duration: string;
  transcript: string;
}

export const SAMPLE_LECTURES: SampleLecture[] = [
  {
    id: 'cs-algorithms',
    title: 'CS 161: Asymptotic Complexity, Big-O Notation & Sorting Limits',
    subject: 'Computer Science',
    badge: 'Algorithms',
    duration: '45 mins transcript',
    transcript: `Alright everyone, let's get started. Settle in. Today we're continuing our journey into algorithm analysis, specifically asymptotic notation—Big-O, Big-Omega, Big-Theta—and how we evaluate computational complexity.

So, why do we care about asymptotic analysis? Well, in the real world, running an algorithm on an array of ten elements is meaningless. Any potato computer will finish in less than a millisecond. What we care about is scalability: how does the resource consumption, particularly runtime T(n), grow as the input size n shoots towards infinity?

Let's write down the formal mathematical definition of Big-O on the board. We say f(n) is O(g(n)) if and only if there exist positive constants c and n_0 such that 0 <= f(n) <= c * g(n) for all n >= n_0. Notice that this is an upper bound. It doesn't mean the algorithm will always take that long; it means in the asymptotic limit, f(n) will not grow faster than some constant multiple of g(n). 

Now, student in the front row asked earlier: "Is Big-O worst-case runtime?" No! Please write this in bold red ink in your notebooks because 90% of job interview candidates mess this up. Big-O is a mathematical relation of growth rate. Worst-case is an execution scenario based on input ordering. You can have a worst-case runtime that is O(n^2), or a best-case runtime that is O(n). For example, insertion sort: best case on an already sorted list is O(n), but worst-case on a reverse sorted list is O(n^2) because for every element i from 1 to n, you might have to shift all i preceding elements.

Next, divide-and-conquer and merge sort. Why does merge sort beat insertion sort for large inputs? Because merge sort breaks the list of size n into two halves of size n/2, recursively sorts both, and merges them in linear O(n) time. The recurrence relation is:
T(n) = 2T(n/2) + O(n).
By Case 2 of the Master Theorem—where a = 2, b = 2, log_b(a) = 1, and f(n) = Theta(n)—the runtime evaluates strictly to Theta(n log n).

Can we sort faster in comparison-based sorting? No! There is a fundamental lower bound: any comparison-based sorting algorithm requires at least Omega(n log n) comparisons in the worst case. Why? Because an array of n items has n! possible permutations. Each comparison gives at most 1 bit of information, dividing the search space of decision tree leaves in two. The height of the decision tree is at least log_2(n!), which by Stirling's approximation is Omega(n log n). Now, non-comparison sorts like Radix Sort or Counting Sort can achieve O(n) under strict constraints, but only when we have bounded integer keys.

One quick note—I think someone in the lab had an issue with space complexity. Merge sort is not in-place in its standard formulation; it requires auxiliary array space of O(n), unlike Heapsort which sorts in-place in O(n log n) time and O(1) auxiliary space. Keep that memory trade-off in mind for your midterm next Wednesday!`
  },
  {
    id: 'bio-cellular',
    title: 'BIO 201: Cellular Respiration, Electron Transport & ATP Synthase',
    subject: 'Biology / Biochemistry',
    badge: 'Biochemistry',
    duration: '50 mins transcript',
    transcript: `Good morning class. Today we're diving into the final, high-yield stage of aerobic cellular respiration: oxidative phosphorylation, the electron transport chain, and chemiosmosis.

To recap where we left off: glucose (C6H12O6) was cleaved during glycolysis in the cytoplasm, producing 2 pyruvate, net 2 ATP, and 2 NADH. Those pyruvates entered the mitochondrial matrix, undergoing pyruvate decarboxylation to form acetyl-CoA, feeding directly into the Krebs citric acid cycle. From one starting glucose molecule, after glycolysis and the citric acid cycle, we've gathered a collection of high-energy electron carriers: 10 NADH and 2 FADH2. But so far, we have only generated 4 ATP via substrate-level phosphorylation. Where is the big energy payout?

The payout happens right here across the inner mitochondrial membrane. The electron transport chain consists of four multiprotein complexes embedded in the lipid bilayer: Complex I (NADH dehydrogenase), Complex II (succinate dehydrogenase), Complex III (cytochrome bc1), and Complex IV (cytochrome c oxidase). Mobile carriers—ubiquinone (Coenzyme Q) and cytochrome c—shuttle electrons between them.

Here's the crucial mechanism: as electrons cascade down the chain towards molecular oxygen (O2)—which acts as the final electron acceptor, reducing into water (H2O)—complexes I, III, and IV pump protons (H+) from the mitochondrial matrix into the intermembrane space. This pumps against the concentration gradient, establishing a powerful electrochemical proton gradient, often referred to as the proton-motive force (PMF).

Notice that Complex II does not pump protons! That's why electrons from FADH2, which enter at Complex II, yield fewer ATPs—approximately 1.5 ATP per FADH2, compared to roughly 2.5 ATP per NADH entering at Complex I.

Now, how does the cell harvest this potential energy? Through Peter Mitchell's chemiosmotic hypothesis, mediated by the molecular rotary motor: ATP Synthase. ATP Synthase has two main components: the F0 rotor embedded in the membrane, and the catalytic F1 headpiece protruding into the matrix. As protons flow down their electrochemical gradient back into the matrix through the F0 channel, it forces the central stalk (gamma subunit) to rotate. This conformational rotation alters the active sites of the beta subunits in F1, catalyzing the condensation of ADP and inorganic phosphate (Pi) into ATP:
ADP + Pi -> ATP.

Total theoretical net yield per glucose molecule under optimal conditions in eukaryotic cells is roughly 30 to 32 ATP. However, if an uncoupling protein like UCP1 (thermogenin in brown adipose tissue) or a chemical uncoupler like DNP is present, protons leak across the inner membrane without passing through ATP Synthase. The energy of the gradient is dissipated as pure heat rather than stored in ATP bonds. This is how hibernating mammals stay warm! Remember this mechanism for the physiology block exam.`
  },
  {
    id: 'phys-thermo',
    title: 'PHYS 140: Second Law of Thermodynamics & The Carnot Heat Engine',
    subject: 'Physics',
    badge: 'Thermodynamics',
    duration: '40 mins transcript',
    transcript: `Welcome back everyone. Today we are exploring the theoretical limits of thermodynamics, the concept of entropy, and the Carnot cycle.

First, let's remember the First Law of Thermodynamics: delta U = Q - W. Energy is conserved. But the First Law does not tell us the direction of spontaneous processes. A hot cup of coffee cooling down to room temperature conserves energy, but room temperature coffee never spontaneously heats up while cooling the surrounding air, even though that wouldn't violate the First Law!

This brings us to the Second Law of Thermodynamics. There are two classical formulations:
1. The Kelvin-Planck statement: It is impossible to construct a heat engine operating in a cycle that absorbs heat from a single reservoir and produces an equivalent amount of work with 100% efficiency.
2. The Clausius statement: Heat cannot spontaneously flow from a colder body to a warmer body without external work being done.

In 1824, French engineer Nicolas Léonard Sadi Carnot devised the ideal, reversible thermodynamic cycle called the Carnot Cycle, operating between two thermal reservoirs: a hot reservoir at absolute temperature T_H and a cold reservoir at absolute temperature T_C.

The Carnot cycle consists of four reversible processes:
1. Isothermal expansion at T_H: the working gas absorbs heat Q_H while expanding reversibly at constant temperature.
2. Adiabatic (isentropic) expansion: gas continues to expand and do work W, insulated so Q = 0, cooling from T_H to T_C.
3. Isothermal compression at T_C: gas is compressed at constant cold temperature, rejecting waste heat Q_C to the reservoir.
4. Adiabatic compression: gas is compressed back to its initial volume and pressure, warming from T_C back up to T_H.

Thermal efficiency eta is defined generally as net work output over heat input:
eta = W_net / Q_H = (Q_H - Q_C) / Q_H = 1 - (Q_C / Q_H).
For a Carnot reversible engine, the ratio of heat transferred equals the ratio of absolute temperatures: Q_C / Q_H = T_C / T_H.
Therefore:
eta_Carnot = 1 - (T_C / T_H).

Crucial rule: T_H and T_C MUST be in Kelvin! If you plug in Celsius on the exam, you will get negative or nonsensical efficiencies and lose all credit.

Carnot's Theorem states: No real heat engine operating between two given temperatures can be more efficient than a Carnot engine, and all reversible engines operating between the same two temperatures have the exact same efficiency regardless of the working substance.

Lastly, entropy S. Clausius defined the change in entropy for a reversible process as dS = dQ_rev / T. In an isolated system, the entropy never decreases: delta S_universe >= 0. Real engines suffer from irreversibilities—friction, turbulence, heat conduction across finite temperature gradients—which means real efficiencies are always strictly below eta_Carnot.`
  },
  {
    id: 'econ-macro',
    title: 'ECON 302: Central Banking, Inflation Targeting & Interest Rates',
    subject: 'Economics / Finance',
    badge: 'Macroeconomics',
    duration: '42 mins transcript',
    transcript: `Good afternoon. Today we're analyzing monetary policy, how central banks like the Federal Reserve manage interest rates, and how policy transmits into the real economy.

Let's begin with the statutory mandate. In the United States, Congress gave the Federal Reserve a "dual mandate":
First, maximum sustainable employment.
Second, stable prices (which the Fed defines as an average 2% annual inflation target as measured by the Core Personal Consumption Expenditures or Core PCE index).

How does the central bank actually influence borrowing costs across the economy? The Fed's primary policy tool is the Federal Funds Rate (FFR)—the interest rate at which commercial depository banks lend reserve balances to each other overnight on an uncollateralized basis.

Historically, before 2008, the Fed operated in a regime of scarce reserves. They used Open Market Operations (buying and selling short-term Treasury bills) to shift the supply curve of reserves. But since the 2008 financial crisis and quantitative easing, we live in an ample-reserves regime. Today, the Fed sets an administered rate called Interest on Reserve Balances (IORB), alongside the Overnight Reverse Repurchase Facility (ON RRP). These act as a hard floor for short-term money market rates.

Now let's examine the monetary transmission mechanism. Suppose inflation rises significantly above 2%. The Federal Open Market Committee (FOMC) votes to hike the policy rate. What is the chain of events?
1. Interest rate channel: Higher policy rates increase short-term borrowing costs for commercial banks, which immediately spreads to the prime rate, mortgages, car loans, and corporate bonds. Cost of capital increases.
2. Investment and consumption channel: High borrowing costs cause businesses to delay capital expenditure (Capex), and households reduce purchases on credit-sensitive durable goods.
3. Asset price channel: Higher discount rates reduce equity valuations and house prices, creating a negative wealth effect that dampens consumer spending.
4. Exchange rate channel: Higher domestic rates attract foreign capital, appreciating the domestic currency, which makes imports cheaper and exports less competitive, putting downward pressure on aggregate demand (AD).

To formalize policy decisions, economists frequently reference the Taylor Rule. Proposed by John Taylor in 1993, it provides a benchmark nominal interest rate:
i = r* + pi + 0.5 * (pi - pi*) + 0.5 * (y - y*)
Where:
- i is the target nominal federal funds rate
- r* is the neutral real interest rate (often assumed around 0.5% to 1.5%)
- pi is current inflation rate, and pi* is the target inflation rate (2%)
- (y - y*) is the output gap: percent deviation of real GDP from potential GDP.

Notice the weights: if inflation exceeds target by 1%, the Taylor rule recommends raising nominal rates by 1.5% (1 + 0.5). That satisfies the Taylor Principle: nominal rates must rise by more than one-for-one with inflation to raise the real interest rate (r = i - pi), cooling aggregate demand.

Be careful not to confuse contractionary monetary policy with fiscal austerity. Monetary policy affects liquidity and interest rates; fiscal policy involves government taxes and spending. That will be on Friday's quiz!`
  }
];
