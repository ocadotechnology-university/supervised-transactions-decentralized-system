## MoSCoW

```mermaid
kanban
  Must have
    [Trader/Customer registration]
    [Trader → Customer transaction]
    [Secure Trader → Customer transaction]
    [Ranking]
  Should Have
    [Customer → Customer transaction]
  Could have
    [Account recovery]
    [Secure Customer → Customer transaction]
  Won't have
    [Blockchain]
    [Using points during session]
```

## Low fidelity mockup

[Figma](https://www.figma.com/proto/TIDiPSxJoRu6MWFVle7tm1/Untitled--Copy-?node-id=2-1892&p=f&t=DvmJ1cJBPvy8EBzg-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A1892&show-proto-sidebar=1)

## Flowchart

```mermaid
flowchart LR
    A([Supervisor starts a session]) --> B(Trader/Customer<br/>registration)
    B --> C(Trader → Customer<br/>transaction)
    C --> D(Supervisor verification)
    D --> E(Update ranking)
```

## Use Case Diagram

```mermaid
flowchart LR
    Customer
    Trader
    Supervisor

    subgraph Supervised Transactions Decentralized System
        U1([Registration])
        U2([Check available points])
        U3_1([Transaction])
        
        U4([Cashout])
        U5([Verification])
        U6([Select a customer])
        
        U3_2([Transaction])
        U7([Sign using a digital signature])
        
        U8([Assign point limit])
        U9([Registration])
        U10([Ranking])
    end

    Customer --> U1
    Customer --> U2
    Customer --> U3_1

    Trader --> U3_2
    Trader --> U7

    Supervisor --> U5
    Supervisor --> U9

    U2 -. "«extends»" .-> U4
    U5 -. "«include»" .-> U4
    U6 -. "«extends»" .-> Customer2[Other Customer]
    
    U3_1 -. "«include»" .-> U6
    U3_2 -. "«include»" .-> U6
    U5 -. "«extends»" .-> U10
    
    U9 -. "«include»" .-> U8
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Supervisor
    participant Trader
    participant Customer1
    Supervisor->>Supervisor: Configure Traders
    Supervisor->>Trader: Registration
    Customer1->>Customer1: Registration
    Trader->>Customer1: Transaction
    create participant Customer2
    Customer1-->>Customer2: Transaction
    Customer1->>Supervisor: Supervisor verification
    Supervisor->>Supervisor: Ranking
    Customer2--xSupervisor: Supervisor verification
```
