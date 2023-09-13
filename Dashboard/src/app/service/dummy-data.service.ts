import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  private data$: Observable<any> = EMPTY;  

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    if (this.data$ === EMPTY) {  
      console.log('Fetching new data...');
      
      const mockJsonData = {
        "message": "OSS Library Details Retrieved",
        "data": [
          {
            "appcode": "app1",
            "bitbucket_key": "key1",
            "repo_name": "repo1",
            "branch_name": "main",
            "library_name": "React",
            "version": "18.2"
          },
          {
            "appcode": "app1",
            "bitbucket_key": "key2",
            "repo_name": "repo2",
            "branch_name": "dev",
            "library_name": "React",
            "version": "11.3"
          },
          {
            "appcode": "app5",
            "bitbucket_key": "key3",
            "repo_name": "repo3",
            "branch_name": "main",
            "library_name": "Angular",
            "version": "16.0"
          },
          {
            "appcode": "app5",
            "bitbucket_key": "key4",
            "repo_name": "repo4",
            "branch_name": "feature",
            "library_name": "Angular",
            "version": "14.0"
          },
          {
            "appcode": "app5",
            "bitbucket_key": "key5",
            "repo_name": "repo5",
            "branch_name": "main",
            "library_name": "Angular",
            "version": "13.0"
          },
          {
            "appcode": "app6",
            "bitbucket_key": "key6",
            "repo_name": "repo6",
            "branch_name": "dev",
            "library_name": "spring-boot",
            "version": "2.5"
          },
          {
            "appcode": "app7",
            "bitbucket_key": "key7",
            "repo_name": "repo7",
            "branch_name": "main",
            "library_name": "spring-boot",
            "version": "2.7"
          },
          {
            "appcode": "app7",
            "bitbucket_key": "key8",
            "repo_name": "repo8",
            "branch_name": "feature",
            "library_name": "spring-boot",
            "version": "3.1"
          },
          {
            "appcode": "app6",
            "bitbucket_key": "key8",
            "repo_name": "repo8",
            "branch_name": "feature",
            "library_name": "spring-boot",
            "version": "2.6"
          }
        ]
      };

      this.data$ = of(mockJsonData).pipe(
        shareReplay(1),
        tap((data: any) => console.log('Fetched and cached data:', data))
      );
    } else {
      console.log('Using cached data.');
    }

    return this.data$;
  }
}

